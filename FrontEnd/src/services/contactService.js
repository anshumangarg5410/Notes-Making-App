import api from './api';

export const contactService = {
  /**
   * Submit a contact message
   * @param {{ name: string, email: string, subject: string, message: string }} payload
   */
  async submitMessage(payload) {
    const response = await api.post('/contact', payload);
    return response.data;
  }
};

export default contactService;

