# Google Merchant Center XML Feed

## Overview
This is a dynamic XML feed that automatically pulls products from your database and formats them according to Google Merchant Center specifications.

## Feed URL
```
https://electromatt.co.ke/google-feed.xml
```

## Features

### ✅ Automatic Product Sync
- Pulls all active products from your MongoDB database
- Updates automatically when products are added/modified
- No manual intervention required

### ✅ Complete Google Merchant Fields
Each product includes:
- **id**: Unique product identifier (MongoDB _id)
- **title**: Product name
- **description**: Product description (cleaned, max 5000 chars)
- **link**: Direct link to product page
- **image_link**: Main product image URL
- **price**: Product price in KES (Kenyan Shillings)
- **availability**: "in stock" or "out of stock"
- **brand**: ELECTROMATT
- **condition**: new
- **product_type**: Product category
- **identifier_exists**: no (since GTINs are not available)

### ✅ Variant Support
Products with variants (size, color, scent, etc.) are handled intelligently:
- Main product entry shows lowest price
- Each variant gets its own entry with unique ID
- Variants are grouped using `item_group_id`
- Variant-specific attributes (size, color) are included

### ✅ Additional Features
- **Sale Prices**: Automatically includes sale prices when oldPrice exists
- **Additional Images**: Up to 10 additional images for simple products
- **XML Escaping**: Proper handling of special characters (&, <, >, ", ')
- **Caching**: 1-hour cache for optimal performance
- **Error Handling**: Graceful fallback if feed generation fails

## How to Use

### 1. Add Feed to Google Merchant Center

1. Go to [Google Merchant Center](https://merchants.google.com/)
2. Navigate to **Products** → **Feeds**
3. Click **Add Feed**
4. Choose **Scheduled fetch**
5. Enter feed URL: `https://electromatt.co.ke/google-feed.xml`
6. Set fetch frequency (recommended: Daily)
7. Save and test the feed

### 2. Monitor Feed Status

Visit the admin panel at:
```
https://electromatt.co.ke/admin/google-feed
```

Here you can:
- View the feed URL
- Copy the URL to clipboard
- Check feed statistics (total products, feed size)
- View feed information and included fields
- Open the feed in a new tab to inspect

### 3. Verify Feed Content

You can view the raw XML feed at:
```
https://electromatt.co.ke/google-feed.xml
```

Or via the API endpoint:
```
https://electromatt.co.ke/api/google-feed
```

## Feed Structure

### Simple Product Example
```xml
<item>
  <g:id>507f1f77bcf86cd799439011</g:id>
  <g:title>Samsung 55" Smart TV</g:title>
  <g:description>4K Ultra HD Smart TV with HDR...</g:description>
  <g:link>https://electromatt.co.ke/product/samsung-55-smart-tv</g:link>
  <g:image_link>https://example.com/image.jpg</g:image_link>
  <g:price>45000.00 KES</g:price>
  <g:availability>in stock</g:availability>
  <g:brand>ELECTROMATT</g:brand>
  <g:condition>new</g:condition>
  <g:product_type>Electronics</g:product_type>
  <g:identifier_exists>no</g:identifier_exists>
</item>
```

### Variant Product Example
```xml
<!-- Main product entry -->
<item>
  <g:id>507f1f77bcf86cd799439011</g:id>
  <g:title>Premium Face Serum</g:title>
  <g:description>Hydrating face serum...</g:description>
  <g:link>https://electromatt.co.ke/product/premium-face-serum</g:link>
  <g:image_link>https://example.com/serum.jpg</g:image_link>
  <g:price>1500.00 KES</g:price>
  <g:availability>in stock</g:availability>
  <g:brand>ELECTROMATT</g:brand>
  <g:condition>new</g:condition>
  <g:product_type>Beauty</g:product_type>
  <g:identifier_exists>no</g:identifier_exists>
</item>

<!-- Variant entries -->
<item>
  <g:id>507f1f77bcf86cd799439011_variant1</g:id>
  <g:title>Premium Face Serum - 30ml</g:title>
  <g:description>Hydrating face serum...</g:description>
  <g:link>https://electromatt.co.ke/product/premium-face-serum</g:link>
  <g:image_link>https://example.com/serum-30ml.jpg</g:image_link>
  <g:price>1500.00 KES</g:price>
  <g:availability>in stock</g:availability>
  <g:brand>ELECTROMATT</g:brand>
  <g:condition>new</g:condition>
  <g:product_type>Beauty</g:product_type>
  <g:item_group_id>507f1f77bcf86cd799439011</g:item_group_id>
  <g:size>30ml</g:size>
  <g:identifier_exists>no</g:identifier_exists>
</item>
```

## Technical Details

### Caching
- Feed is cached for 1 hour (`s-maxage=3600`)
- Stale content can be served for up to 2 hours while revalidating (`stale-while-revalidate=7200`)
- This ensures fast response times while keeping data relatively fresh

### Product Filtering
Only products that meet these criteria are included:
- `isActive: true`
- Has a valid title
- Has at least one image
- Has a price greater than 0

For variant products:
- Only active variants with stock > 0 are included
- Each variant becomes a separate feed item

### Price Handling
- Simple products: Uses the `price` field
- Variant products: Main entry shows lowest variant price
- Sale prices: Included when `oldPrice` > current price

### Availability Logic
- Simple products: "in stock" if `inStock: true` and `stockQuantity > 0`
- Variant products: "in stock" if any variant has `stock > 0` and `isActive: true`

## Troubleshooting

### Feed Not Updating
1. Check if products are marked as `isActive: true`
2. Wait up to 1 hour for cache to expire
3. Verify products have required fields (name, image, price)

### Products Missing from Feed
Products are excluded if:
- `isActive: false`
- No images available
- Price is 0 or undefined
- For variants: all variants are inactive or out of stock

### Google Merchant Center Errors
Common issues and solutions:

**"Missing required field"**
- Ensure all products have name, description, image, and price

**"Invalid price format"**
- Prices are formatted as "XXXX.XX KES" (e.g., "1500.00 KES")

**"Image not accessible"**
- Verify image URLs are publicly accessible
- Check that images are hosted on HTTPS

**"Invalid XML"**
- Special characters are automatically escaped
- If issues persist, check product descriptions for unusual characters

## Files

### API Route
- **Location**: `app/api/google-feed/route.ts`
- **Purpose**: Generates the XML feed dynamically
- **Method**: GET

### Admin Page
- **Location**: `app/admin/google-feed/page.tsx`
- **Purpose**: View and manage the feed
- **Features**: Copy URL, view stats, documentation

### Next.js Config
- **Location**: `next.config.mjs`
- **Purpose**: Rewrites `/google-feed.xml` to `/api/google-feed`

## Support

For issues or questions:
1. Check the admin panel at `/admin/google-feed`
2. View the raw feed at `/google-feed.xml`
3. Check server logs for errors
4. Verify database connection and product data

## Updates

The feed automatically reflects:
- New products added to the database
- Product updates (price, stock, images)
- Product deletions (when marked inactive)
- Variant changes

No manual updates or regeneration required!
