/**
 * Masks an email address for privacy display
 * @param email - The email address to mask
 * @returns Masked email string (e.g., "Oli*******@std.mans.edu.eg")
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return "Olivia*******@std.mans.edu.eg"
  const [local, domain] = email.split('@')
  if (local.length <= 3) return email
  const maskedLocal = local.slice(0, 3) + "****..."
  return `${maskedLocal}@${domain}`
}