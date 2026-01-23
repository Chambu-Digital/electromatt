// WhatsApp integration service

export interface WhatsAppMessage {
  to: string
  message: string
  type: 'order' | 'inquiry' | 'support'
}

export const generateOrderMessage = (
  firstName: string,
  lastName: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  address: string
): string => {
  const itemsList = items
    .map((item) => `${item.name} (Qty: ${item.quantity}) - KSH ${item.price.toFixed(2)}`)
    .join('\n')

  return `Hello ELECTROMATT Store!

I would like to place an order:

Customer Details:
Name: ${firstName} ${lastName}
Address: ${address}

Order Items:
${itemsList}

Total: KSH ${total.toFixed(2)}

Please confirm my order and provide payment details.

Thank you!`
}

export const generateInquiryMessage = (
  name: string,
  inquiry: string
): string => {
  return `Hello ELECTROMATT Store!

I have an inquiry:

Name: ${name}
Message: ${inquiry}

Please get back to me soon.

Thank you!`
}

export const generateSupportMessage = (
  orderNumber: string,
  issue: string
): string => {
  return `Hello ELECTROMATT Store!

I need help with my order:

Order Number: ${orderNumber}
Issue: ${issue}

Please assist me.

Thank you!`
}

export const sendWhatsAppMessage = (
  message: string,
  businessPhone: string = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254702113628'
) => {
  const encodedMessage = encodeURIComponent(message)
  const whatsappLink = `https://wa.me/${businessPhone}?text=${encodedMessage}`
  window.open(whatsappLink, '_blank')
}

export const openWhatsAppChat = (
  businessPhone: string = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254702113628'
) => {
  const whatsappLink = `https://wa.me/${businessPhone}`
  window.open(whatsappLink, '_blank')
}

// Business profile information for WhatsApp
export const BUSINESS_PROFILE = {
  name: 'ELECTROMATT Store',
  description: 'Kenya\'s trusted electronics retailer since 2018. Quality appliances, competitive prices, exceptional service.',
  address: 'Agro House, Moi Avenue, 1st Floor Rm 35, Nairobi, Kenya',
  phone: '+254 702 113 628',
  email: 'info@electromatt.co.ke',
  website: 'https://electromatt.co.ke',
  businessHours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-5PM, Sun: 10AM-4PM',
  logo: '/electromatt-logo.svg'
}
