import { setupServer } from 'msw/node';
import { cartHandlers } from './cartHandlers';
import { wishlistHandlers } from './wishlistHandlers';
import { checkoutHandlers } from './checkoutHandlers';
import { orderHandlers } from './orderHandlers';
import { addressHandlers } from './addressHandlers';

export const server = setupServer(
  ...cartHandlers,
  ...wishlistHandlers,
  ...checkoutHandlers,
  ...orderHandlers,
  ...addressHandlers
);
