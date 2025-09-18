import QRCode from 'qrcode'

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrCodeDataURL
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    throw new Error('Falha ao gerar QR Code')
  }
}

export function generateUniqueTicketNumber(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `TK-${timestamp}-${random}`.toUpperCase()
}

export function generateUniqueQRCodeData(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 12)
  return `QR-${timestamp}-${random}`.toUpperCase()
}

