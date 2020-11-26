import { v4 as uuid } from 'uuid';

export const createWidgetId = () => `widget/${uuid()}`;
