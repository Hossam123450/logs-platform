// tests/unit/utils/maskSensitiveData.test.js
import { maskSensitiveData } from '../../../utils/maskSensitiveData.js';

describe('maskSensitiveData', () => {
  it('doit masquer les champs sensibles dans un objet', () => {
    const input = {
      password: '1234',
      token: 'abcd',
      nested: {
        apiKey: 'key123',
        safe: 'ok',
      },
    };

    const output = maskSensitiveData(input);

    expect(output.password).toBe('[MASKED]');
    expect(output.token).toBe('[MASKED]');
    expect(output.nested.apiKey).toBe('[MASKED]');
    expect(output.nested.safe).toBe('ok'); // champ non sensible
  });

  it('doit gérer un tableau d\'objets', () => {
    const input = [
      { password: '123', safe: 'ok1' },
      { apiKey: '456', safe: 'ok2' },
    ];

    const output = maskSensitiveData(input);

    expect(output[0].password).toBe('[MASKED]');
    expect(output[0].safe).toBe('ok1');
    expect(output[1].apiKey).toBe('[MASKED]');
    expect(output[1].safe).toBe('ok2');
  });

  it('ne doit rien modifier pour les primitives', () => {
    expect(maskSensitiveData('hello')).toBe('hello');
    expect(maskSensitiveData(123)).toBe(123);
    expect(maskSensitiveData(null)).toBeNull();
    expect(maskSensitiveData(undefined)).toBeUndefined();
  });
});
