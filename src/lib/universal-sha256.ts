const sha256_node = (data: string): Promise<string> => {
  const crypto = require('crypto');
  //промис для выравнивания сигнатур функций
  return Promise.resolve(
    crypto.createHash('sha256').update(data).digest('hex')
  );
};

//использует асинхронный crypto API
const sha256_browser = async (data: string): Promise<string> => {
  const msgUint8Array = new TextEncoder().encode(data); //кодируем строку в utf-8
  const hashByteArray = await crypto.subtle.digest('SHA-256', msgUint8Array); //хэшируем данные
  const hashArray = Array.from(new Uint8Array(hashByteArray)); //преобразование в array
  return hashArray.map((b) => '00' + b.toString(16).slice(-2)).join(''); //преобразуем байты в шестнадцатеричную строку
};

//динамический экспорт
export const sha256 =
  typeof window === 'undefined' ? sha256_node : sha256_browser;
