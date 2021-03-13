'use strict';

import { DataTypes, Model, ModelDefined, Optional, Sequelize } from 'sequelize';
import { field } from '..';

export interface UserAttribute {
	id: number;
	email: string;
	password: string;
	nickname: string;
	photo: string | null;
	birthday: string | null;
}

interface UserCreateAttributes extends Optional<UserAttribute, 'id' | 'photo' | 'birthday'> {}

type M = Model<UserAttribute, UserCreateAttributes>;

const defineModel = (sequelize: Sequelize) => {
	const User: ModelDefined<UserAttribute, UserCreateAttributes> = sequelize.define(
		'User',
		// fields
		{
			email: field<M>(DataTypes.STRING, '이메일, 로그인 아이디로 사용', true),
			password: field<M>(DataTypes.STRING, '비밀번호', true),
			nickname: field<M>(DataTypes.STRING, '닉네임', true),
			photo: field<M>(DataTypes.STRING, '프로필사진'),
			birthday: field<M>(DataTypes.STRING, '생년월일'),
		},
		// options
		{
			tableName: 'users',
			modelName: 'user',
			indexes: [{ unique: true, fields: ['email'] }],
		}
	);

	return User;
};

const associate = (sequelize: Sequelize) => {
	const { User } = sequelize.models;
	// relations
};

export default { defineModel, associate };
