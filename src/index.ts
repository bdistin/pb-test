import { Client, ClientEvents, Message } from '@klasa/core';
import { EventIterator } from '@klasa/event-iterator';
import { commands } from './commands';
import * as config from './config.json';

const { token, idle, id } = config;

const client = new Client({ rest: { offset: 0 } })
	.on(ClientEvents.Debug, console.log)
	.on(ClientEvents.WTF, console.log)
	.on(ClientEvents.EventError, console.log)
	.on(ClientEvents.Ready, () => console.log('Ready'))
	.on(ClientEvents.ShardReady, (shard) => console.log(`${shard.id} is ready`));

client.token = token;

client.connect()
	.then(async () => {
		for await (const message of new EventIterator<Message>(client, ClientEvents.MessageCreate, { idle: idle || Infinity, filter: msg => msg.author.id === id })) {
			const split = message.content.split(' ');
			const command = split.shift();
			if (Reflect.has(commands, command!)) {
				message.channel.typing.start();
				commands[command!](message, split)
					.catch(console.error)
					.finally(message.channel.typing.stop.bind(message.channel.typing));
			}
		}
	})
	.catch(console.error)
	.finally(client.destroy.bind(client));
