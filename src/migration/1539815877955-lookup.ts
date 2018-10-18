import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Lookup1539815877955 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'lookup',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'point',
                    type: 'int',
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('lookup');
    }

}
