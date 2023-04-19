import { sendDiscordNotification } from '../src/sendDiscordNotification';
import { AmazonSite, Product, DiscordNotification } from '../src/types';

describe.skip('sendDiscordNotification', () => {
  it('should send a notification to Discord webhook', async () => {
    const notification: DiscordNotification = {
      username: 'Amazon Scraper Bot',
      avatarUrl: 'https://i.imgur.com/wSTFkRM.png',
      product: {
        title: 'Example Product',
        link: 'https://www.amazon.com/dp/B08L5WRJCC',
        image: 'https://m.media-amazon.com/images/I/51zV36jKskL._AC_UY218_.jpg',
        originalPrice: 100,
        price: 80,
        discountRaw: 20.20,
        discount: '20.20',
      },
    };

    const result = await sendDiscordNotification(notification);
    expect(result).toBeInstanceOf(Object);
  });
});
