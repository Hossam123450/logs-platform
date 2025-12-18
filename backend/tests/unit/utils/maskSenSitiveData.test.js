// backend/tests/unit/utils/maskSensitiveData.test.js
import { maskSensitiveData } from '../../../utils/maskSensitiveData.js';

describe('maskSensitiveData', () => {
  it('doit masquer les champs sensibles', () => {
    const input = {
      password: '123456',
      token: 'abcdef',
      nested: {
        apiKey: 'key123',
        safe: 'ok'
      }
    };
    const output = maskSensitiveData(input);

    expect(output.password).toBe('[MASKED]');
    expect(output.token).toBe('[MASKED]');
    expect(output.nested.apiKey).toBe('[MASKED]');
    expect(output.nested.safe).toBe('ok');
  });

  it('doit gérer un tableau', () => {
    const input = [
      { password: '123' },
      { apiKey: '456' }
    ];
    const output = maskSensitiveData(input);

    expect(output[0].password).toBe('[MASKED]');
    expect(output[1].apiKey).toBe('[MASKED]');
  });
});
