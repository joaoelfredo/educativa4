/**
 * Verifica se uma string tem o formato de um e-mail válido.
 * @param {string} email O e-mail a ser validado.
 * @returns {boolean} Retorna true se o e-mail for válido, false caso contrário.
 */
export const isValidEmail = (email) => {
  // Esta é uma expressão regular simples e eficaz para a maioria dos casos.
  // Ela verifica se há caracteres antes do @, depois do @, um ponto, e caracteres depois do ponto.
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};