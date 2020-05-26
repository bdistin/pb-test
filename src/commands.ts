import { sleep } from '@klasa/utils';
import { inspect } from 'util';

import type { Message } from '@klasa/core';

export const commands: Record<string, (message: Message, args: string[]) => Promise<Message | Message[]>> = {
	async ping(message: Message) {
		const [response] = await message.channel.send(mb => mb.setContent('ping?'));
		return response.edit(mb => mb.setContent(`Pong! Took: ${response.createdTimestamp - message.createdTimestamp}ms`));
	},

	async eval(message: Message, args: string[]) {
		let returned: unknown;
		try {
			returned = await eval(args.join(' '));
		} catch (error) {
			returned = error;
		}
		return message.channel.send(async (mb) => mb.setContent(`\`\`\`\n${inspect(returned, { depth: 0 })}\n\`\`\``), { prepend: '```\n', append: '```' });
	},

	info(message: Message) {
		return message.channel.send(mb => mb
			.setEmbed(embed => embed
				.setTitle('Hello from Project Blue (@klasa/core)')
				.setDescription(`
We have been working hard on this project, and really kicked ass as of late.
The core library is written in TypeScript, and our utilities are separate and tested.
The websocket connections are in workers, so you won't stop their beating heart with any while loops.
The rest manager utilizes hashes to maximize your sending experience.`)
				.setColor(0x0066FF)
				.setImage('https://i.ytimg.com/vi/hAsZCTL__lo/maxresdefault.jpg')
			)
		);
	},

	async type(message: Message) {
		await sleep(20000);
		return message.channel.send(mb => mb
			.setContent('gosh that\'s a slow command')
		);
	}
};