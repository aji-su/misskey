import { EntityRepository, Repository } from 'typeorm';
import { Users } from '../index';
import { ModerationLog } from '@/models/entities/moderation-log';
import { awaitAll } from '@/prelude/await-all';

@EntityRepository(ModerationLog)
export class ModerationLogRepository extends Repository<ModerationLog> {
	public async pack(
		src: ModerationLog['id'] | ModerationLog,
	) {
		const log = typeof src === 'object' ? src : await this.findOneOrFail(src);

		return await awaitAll({
			id: log.id,
			createdAt: log.createdAt.toISOString(),
			type: log.type,
			info: log.info,
			userId: log.userId,
			user: Users.pack(log.user || log.userId, null, {
				detail: true,
			}),
		});
	}

	public packMany(
		reports: any[],
	) {
		return Promise.all(reports.map(x => this.pack(x)));
	}
}
