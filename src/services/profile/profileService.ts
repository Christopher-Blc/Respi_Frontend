import api from '../api';
import { ChangePasswordDto } from '../../types/types';

export const profileService = {
  async changePassword(dto: ChangePasswordDto): Promise<void> {
    await api.patch('/users/profile/change-password', dto);
  },
};
