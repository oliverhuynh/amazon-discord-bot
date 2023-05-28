import { WebhookClient, EmbedBuilder } from 'discord.js';
import { AmazonSite, Product, DiscordNotification } from './types';
require('dotenv').config();

const notificationQueue: DiscordNotification[] = [];
let isSendingNotification = false;
const webhookUrl = process.env.WEBHOOK;
const delay = parseInt(process.env.DELAY);

export const sendNotification = async(notification: DiscordNotification) => {
  const { username, avatarUrl, product } = notification;

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(product.title.substr(0,200))
    .setURL(product.link)
    .setThumbnail(product.image)
    .addFields(
      // { name: 'Original Price', value: `${product.originalPrice}`, inline: true },
      { name: 'Price', value: `${product.price}`, inline: true },
      { name: 'Discount', value: `${product.discount}%`, inline: true },
      { name: 'Shipping', value: `${product.shipping}`, inline: true },
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

export const sendDiscordNotification = async(notification: DiscordNotification) => {
  notificationQueue.push(notification);
  if (!isSendingNotification) {
    isSendingNotification = true;
    while (notificationQueue.length > 0) {
      const notification = notificationQueue.shift();
      await sendMessageWithDelay(notification, delay);
    }
    isSendingNotification = false;
  }
  return notification;
}

function sendMessageWithDelay(notification: DiscordNotification, delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      await sendNotification(notification);
      resolve();
    }, delayMs);
  });
}
