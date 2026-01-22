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
    .map((item) => `• ${item.name} (Qty: ${item.quantity}) - KSH ${item.price.toFixed(2)}`)
    .join('\n')

  return `Hi Electromatt,

I would like to place an order:

*Customer Details:*
Name: ${firstName} ${lastName}
Address: ${address}

*Order Items:*
${itemsList}

*Total: KSH ${total.toFixed(2)}*

Please confirm my order and provide payment details.

Thank you!`
}

export const generateInquiryMessage = (
  name: string,
  inquiry: string
): string => {
  return `Hi Electromatt,

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
  return `Hi Electromatt Support,

I need help with my order:

Order Number: ${orderNumber}
Issue: ${issue}

Please assist me.

Thank you!`
}

export const sendWhatsAppMessage = (
  message: string,
  businessPhone: string = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254712345678'
) => {
  const encodedMessage = encodeURIComponent(message)
  const whatsappLink = `https://wa.me/${businessPhone}?text=${encodedMessage}`
  window.open(whatsappLink, '_blank')
}

export const openWhatsAppChat = (
  businessPhone: string = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254712345678'
) => {
  const whatsappLink = `https://wa.me/${businessPhone}`
  window.open(whatsappLink, '_blank')
}
