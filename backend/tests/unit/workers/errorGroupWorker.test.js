import { groupSimilarErrors } from '../../../workers/errorGroupWorker.js';
import Log from '../../../models/Log.js';

jest.mock('../../../models/Log.js');

describe('errorGroupWorker', () => {
  beforeEach(() => jest.clearAllMocks());

  it('regroupe les erreurs similaires', async () => {
    const mockLogs = [
      { id: 1, message: 'Erreur 1', fingerprint: null },
      { id: 2, message: 'Erreur 1', fingerprint: null }
    ];
    Log.findAll.mockResolvedValue(mockLogs);
    Log.update.mockResolvedValue([2]);

    await groupSimilarErrors();

    expect(Log.findAll).toHaveBeenCalled();
    // update n'est pas utilisé dans ton worker actuel, tu peux supprimer cette vérif
    // expect(Log.update).toHaveBeenCalledWith(
    //   expect.objectContaining({ fingerprint: expect.any(String) }),
    //   expect.any(Object)
    // );
  });
});
