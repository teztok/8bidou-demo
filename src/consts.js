// 8x8 color
export const FA2_CONTRACT = process.env.REACT_APP_FA2_CONTRACT || 'KT1MxDwChiDwd6WBVs24g1NjERUoK622ZEFp';
export const MARKETPLACE_CONTRACT = process.env.REACT_APP_MARKETPLACE_CONTRACT || 'KT1BvWGFENd4CXW5F3u4n31xKfJhmBGipoqF';
export const PIXEL_FORMAT = process.env.REACT_APP_PIXEL_FORMAT ? parseInt(process.env.REACT_APP_PIXEL_FORMAT, 10) : 8;
export const COLOR_FORMAT = process.env.REACT_APP_COLOR_FORMAT || 'hex';
export const EVENT_TYPE_PREFIX = process.env.REACT_APP_EVENT_TYPE_PREFIX || '8BID_8X8_COLOR';

// 24x24 monochrome
//export const FA2_CONTRACT = 'KT1TR1ErEQPTdtaJ7hbvKTJSa1tsGnHGZTpf';
//export const MARKETPLACE_CONTRACT = 'KT1AHBvSo828QwscsjDjeUuep7MgApi8hXqA';
//export const PIXEL_FORMAT = 24;
//export const COLOR_FORMAT = 'monochrome';
//export const EVENT_TYPE_PREFIX = '8BID_24X24_MONOCHROME'

export const TEZTOK_API = 'https://api.teztok.com/v1/graphql';
