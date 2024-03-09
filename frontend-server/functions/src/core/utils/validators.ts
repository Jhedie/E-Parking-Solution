/** source: https://stackoverflow.com/a/9204568/4508758 */
export function validateEmail(email: string): boolean {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
