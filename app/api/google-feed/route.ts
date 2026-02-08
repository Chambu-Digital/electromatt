import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Helper function to get the lowest price for variant products
function getLowestPrice(product: any): number {
  if (product.hasVariants && product.variants && product.variants.length > 0) {
    const activePrices = product.variants
      .filter((v: any) => v.isActive && v.stock > 0)
      .map((v: any) => v.price)
    return activePrices.length > 0 ? Math.min(...activePrices) : 0
  }
  return product.price || 0
}

// Helper function to get availability status
function getAvailability(product: any): string {
  if (!product.isActive) return 'out of stock'
  
  if (product.hasVariants && product.variants && product.variants.length > 0) {
    const hasStock = product.variants.some((v: any) => v.isActive && v.stock > 0)
    return hasStock ? 'in stock' : 'out of stock'
  }
  
  return product.inStock && product.stockQuantity > 0 ? 'in stock' : 'out of stock'
}

// Helper function to clean and truncate description
function cleanDescription(description: string): string {
  if (!description) return ''
  // Remove HTML tags, extra whitespace, and limit to 5000 characters (Google's limit)
  return description
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 5000)
}

// Helper function to get the main image
function getMainImage(product: any): string {
  if (product.hasVariants && product.variants && product.variants.length > 0) {
    const activeVariant = product.variants.find((v: any) => v.isActive && v.stock > 0)
    if (activeVariant && activeVariant.image) return activeVariant.image
  }
  
  if (product.images && product.images.length > 0) {
    return product.images[0]
  }
  
  return ''
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Fetch all active products
    const products = await Product.find({ isActive: true })
      .select('_id name slug description price oldPrice images hasVariants variants category inStock stockQuantity tags')
      .lean()

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://electromatt.co.ke'
    const currentDate = new Date().toISOString()

    // Build XML feed
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ELECTROMATT - Premium Electronics &amp; Appliances</title>
    <link>${baseUrl}</link>
    <description>Quality electronics and appliances in Kenya</description>
    <lastBuildDate>${currentDate}</lastBuildDate>
`

    // Add each product as an item
    for (const product of products) {
      const productId = product._id.toString()
      const title = escapeXml(product.name)
      const description = escapeXml(cleanDescription(product.description))
      const link = `${baseUrl}/product/${product.slug}`
      const imageLink = getMainImage(product)
      const price = getLowestPrice(product)
      const availability = getAvailability(product)
      const brand = 'ELECTROMATT'
      const condition = 'new'

      // Skip products without essential data
      if (!title || !imageLink || price <= 0) {
        continue
      }

      xml += `    <item>
      <g:id>${productId}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:price>${price.toFixed(2)} KES</g:price>
      <g:availability>${availability}</g:availability>
      <g:brand>${brand}</g:brand>
      <g:condition>${condition}</g:condition>
`

      // Add category if available
      if (product.category) {
        xml += `      <g:product_type>${escapeXml(product.category)}</g:product_type>
`
      }

      // Add additional images for simple products
      if (!product.hasVariants && product.images && product.images.length > 1) {
        for (let i = 1; i < Math.min(product.images.length, 11); i++) {
          xml += `      <g:additional_image_link>${product.images[i]}</g:additional_image_link>
`
        }
      }

      // Add sale price if old price exists
      if (!product.hasVariants && product.oldPrice && product.oldPrice > price) {
        xml += `      <g:sale_price>${price.toFixed(2)} KES</g:sale_price>
`
      }

      // Add identifier_exists (set to false since we don't have GTINs)
      xml += `      <g:identifier_exists>no</g:identifier_exists>
`

      xml += `    </item>
`

      // Handle variant products - create separate entries for each variant
      if (product.hasVariants && product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          if (!variant.isActive || variant.stock <= 0) continue

          const variantId = `${productId}_${variant.id}`
          const variantTitle = escapeXml(`${product.name} - ${variant.value}`)
          const variantPrice = variant.price
          const variantAvailability = variant.stock > 0 ? 'in stock' : 'out of stock'

          xml += `    <item>
      <g:id>${variantId}</g:id>
      <g:title>${variantTitle}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${variant.image}</g:image_link>
      <g:price>${variantPrice.toFixed(2)} KES</g:price>
      <g:availability>${variantAvailability}</g:availability>
      <g:brand>${brand}</g:brand>
      <g:condition>${condition}</g:condition>
`

          if (product.category) {
            xml += `      <g:product_type>${escapeXml(product.category)}</g:product_type>
`
          }

          // Add variant-specific attributes
          xml += `      <g:item_group_id>${productId}</g:item_group_id>
`

          // Map variant type to Google Shopping attributes
          if (variant.type === 'size') {
            xml += `      <g:size>${escapeXml(variant.value)}</g:size>
`
          } else if (variant.type === 'color') {
            xml += `      <g:color>${escapeXml(variant.value)}</g:color>
`
          }

          // Add sale price if old price exists
          if (variant.oldPrice && variant.oldPrice > variantPrice) {
            xml += `      <g:sale_price>${variantPrice.toFixed(2)} KES</g:sale_price>
`
          }

          xml += `      <g:identifier_exists>no</g:identifier_exists>
`

          xml += `    </item>
`
        }
      }
    }

    xml += `  </channel>
</rss>`

    // Return XML with proper content type
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })

  } catch (error) {
    console.error('Error generating Google Merchant feed:', error)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate feed</error>',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
      }
    )
  }
}
