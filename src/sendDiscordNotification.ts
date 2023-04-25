import { WebhookClient, EmbedBuilder } from 'discord.js';
import { AmazonSite, Product, DiscordNotification } from './types';
require('dotenv').config();
import pLimit from 'p-limit';
const limit = pLimit(1);
import fetch from 'node-fetch';

const queue: any[] = []; // define a queue to store the notifications
const webhookUrl = process.env.WEBHOOK;

export const sendDiscordNotification = async(notification: DiscordNotification) => {
  queue.push(notification);
  // execute the queue using the rate limiter
  await limit(async () => {
    const notification = queue.shift();
    if (notification) {
      const { username, avatarUrl, product } = notification;

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(product.title)
        .setURL(product.link)
        .setThumbnail(product.image)
        .addFields(
          { name: 'Original Price', value: `${product.originalPrice}`, inline: true },
          { name: 'Price', value: `${product.price}`, inline: true },
          { name: 'Discount', value: `${product.discount}%`, inline: true },
          { name: 'Shipping Cost', value: `${product.shippingCost}`, inline: true },
        )
        .setTimestamp()
        .setFooter({text: 'Amazon Scraper Bot', iconURL: avatarUrl});

      const webhookClient = new WebhookClient({ url: webhookUrl });

      const ret =await webhookClient.send({
        username,
        avatarURL: avatarUrl,
        embeds: [embed],
      });

      webhookClient.destroy();
      return ret;
    }
  });
  return notification;
}

