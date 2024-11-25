const fs = require('fs');
const path = require('path');

function kebabToCamelCase(str) {
	// Remove caracteres inválidos, converte '-' para '_', e transforma em camelCase
	const snakeCase = str
			.replace(/[^a-zA-Z-]/g, "") // Remove caracteres não permitidos
			.replace(/-/g, "_");        // Converte '-' para '_'
	
	return snakeCase.replace(/_([a-zA-Z])/g, (_, letter) => letter.toUpperCase());
}

function createModule(moduleName) {
	// Converte kebab para snake case
	moduleName = kebabToCamelCase(moduleName);        
	const modulePath = path.join(__dirname, `src/modules/${moduleName}`);

	const dirs = ['controllers', 'services', 'dtos', 'entities', 'types'];

	// Cria os diretórios
	// biome-ignore lint/complexity/noForEach: <explanation>
	dirs.forEach(dir => {
		const dirPath = path.join(modulePath, dir);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	});
	const propName = moduleName;
	const className = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
	// Cria arquivos básicos
	fs.writeFileSync(
		path.join(modulePath, `${propName}.module.ts`),
		`import { Module } from '@nestjs/common';\nimport { ${className}Controller } from './controllers/${propName}.controller';\nimport { ${className}Service } from './services/${propName}.service';\nModule({\n\timports: [],\n\tcontrollers: [${className}Controller],\n\tproviders: [${className}Service],\n})\nexport class ${className}Module {}`,
	);
	fs.writeFileSync(
		path.join(modulePath, `controllers/${propName}.controller.ts`),
		`import { Controller } from '@nestjs/common';\n\n@Controller('${propName}')\nexport class ${className}Controller {}`,
	);
	fs.writeFileSync(
		path.join(modulePath, `services/${propName}.service.ts`),
		`import { Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class ${className}Service {}`,
	);
	fs.writeFileSync(path.join(modulePath, `dtos/${propName}.dto.ts`), `export class ${className}Dto {}`);
	fs.writeFileSync(
		path.join(modulePath, `entities/${propName}.entity.ts`),
		`import type { I${className} } from "@modules/${propName}/types/${propName}";\nimport { type IProvider, ProvidersEnum } from "@shared/providers";\nimport {Types,Schema} from "mongoose"\nexport class ${className}Entity implements I${className} {}\nexport const ${className}Schema = new Schema<${className}Entity>({\n_id: Types.ObjectId,\n})\nexport const ${className}Provider: IProvider = {\nname: ProvidersEnum.${className.toUpperCase()},\nschema: ${className}Schema\n}`,
	);
	fs.writeFileSync(
		path.join(modulePath, `types/${propName}.ts`),
		`import type { DBEntity } from "@modules/shared/types";\nexport interface I${className} extends DBEntity {}`,
	);
	// Atualiza o arquivo @shared/providers.ts
	const providersPath = path.join(__dirname, 'src/modules/shared/providers.ts');

	// Verifica se o arquivo existe
	if (fs.existsSync(providersPath)) {
		let content = fs.readFileSync(providersPath, 'utf-8');

		// Adiciona a importação do provider
		const importStatement = `import { ${className}Provider } from '@modules/${propName}/entities/${propName}.entity';`;
		if (!content.includes(importStatement)) {
			content = `${importStatement}\n${content}`;
		}

		// Adiciona o novo enum se não estiver presente
		const newEnum = `\t${className.toUpperCase()} = '${className.toUpperCase()}',`;
		if (!content.includes(newEnum)) {
			const enumInsertIndex = content.indexOf('export enum ProvidersEnum {') + 'export enum ProvidersEnum {'.length;
			content = `${content.slice(0, enumInsertIndex)}\n${newEnum}${content.slice(enumInsertIndex)}`;
		}

		// Adiciona o provider ao array de providers
		const providersArrayRegex = /export const Providers:\s*IProvider\[\]\s*=\s*\[(\s*.*?)\];/s;
		const match = content.match(providersArrayRegex);
		if (match) {
			const existingProviders = match[1];
			if (!existingProviders.includes(`${className}Provider`)) {
				const updatedProvidersArray = existingProviders.trim()
					? `${existingProviders.trim()}, ${className}Provider`
					: `${className}Provider`;
				content = content.replace(
					providersArrayRegex,
					`export const Providers: IProvider[] = [${updatedProvidersArray}];`,
				);
			}
		} else {
			// Caso o array Providers não exista
			content += `\nexport const Providers: IProvider[] = [${className}Provider];\n`;
		}

		// Salva as alterações
		fs.writeFileSync(providersPath, content, 'utf-8');
	} else {
		console.warn('Arquivo @shared/providers.ts não encontrado. Crie a importação e o enum manualmente.');
	}
}

const moduleName = process.argv[2];
if (!moduleName) {
	console.log('Por favor, forneça o nome do módulo.');
	process.exit(1);
}

createModule(moduleName);
console.log(`Módulo ${moduleName} criado com sucesso!`);
