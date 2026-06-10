import { setupServer } from 'msw/node';
import { cartHandlers } from './cartHandlers';
import { wishlistHandlers } from './wishlistHandlers';

export const server = setupServer(...cartHandlers, ...wishlistHandlers);
