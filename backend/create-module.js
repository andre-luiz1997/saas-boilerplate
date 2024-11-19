const fs = require("fs");
const path = require("path");

function createModule(moduleName) {
	const modulePath = path.join(
		__dirname,
		`src/modules/${moduleName.toLowerCase()}`,
	);

	const dirs = ["controllers", "services", "repositories", "dtos", "entities"];

	// Cria os diretórios
	// biome-ignore lint/complexity/noForEach: <explanation>
	dirs.forEach((dir) => {
		const dirPath = path.join(modulePath, dir);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	});
	const propName = moduleName.toLowerCase();
	const className = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
	// Cria arquivos básicos
	fs.writeFileSync(
		path.join(modulePath, "auth.module.ts"),
		`import { Module } from '@nestjs/common';\nimport { ${className}Controller } from './controllers/${propName}.controller';\nimport { ${className}Service } from './services/${propName}.service';\nModule({\n\timports: [],\n\tcontrollers: [${className}Controller],\n\tproviders: [${className}Service],\n})\nexport class ${className}Module {}`,
	);
	fs.writeFileSync(
		path.join(modulePath, "controllers/auth.controller.ts"),
		`import { Controller } from '@nestjs/common';\n\n@Controller('${propName}')\nexport class ${className}Controller {}`,
	);
	fs.writeFileSync(
		path.join(modulePath, "services/auth.service.ts"),
		`import { Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class ${className}Service {}`,
	);
	fs.writeFileSync(
		path.join(modulePath, `repositories/${propName}.repository.ts`),
		`export class ${className}Repository {}`,
	);
	fs.writeFileSync(
		path.join(modulePath, `dtos/${propName}.dto.ts`),
		`export class ${className}Dto {}`,
	);
	fs.writeFileSync(
		path.join(modulePath, `entities/${propName}.entity.ts`),
		`export class ${className}Entity {}`,
	);
}

const moduleName = process.argv[2];
if (!moduleName) {
	console.log("Por favor, forneça o nome do módulo.");
	process.exit(1);
}

createModule(moduleName);
console.log(`Módulo ${moduleName} criado com sucesso!`);
