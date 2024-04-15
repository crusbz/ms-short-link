import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserModel } from 'src/user/db/typeorm/models/user.model';
import { ShortLinkModel } from 'src/short-link/db/typeorm/models/short-link.model';

export const dataOptions: DataSourceOptions = {
  url: process.env.DB_URL,
  type: 'postgres',
  migrations: [__dirname + '/migrations/{*.js,*.ts}'],
  entities: [UserModel, ShortLinkModel],
  synchronize: false,
  poolSize: 3,
};

const dataSource = new DataSource(dataOptions);
export default dataSource;
