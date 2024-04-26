import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

export function vuePreprocessor(code: string, options: PrettierOptions) {
    const { parse } = require('@vue/compiler-sfc');
    const { descriptor } = parse(code);

    const scriptContent = descriptor.script?.content;
    const scriptSetupContent = descriptor.scriptSetup?.content;

    if (!scriptContent && !scriptSetupContent) {
        return code;
    }

    let transformedCode = code;

    const replacer = (content: string) => {
        // the second argument of "".replace is a function to avoid the special dollar sign replace group functionality
        return transformedCode.replace(
            content,
            () => `\n${preprocessor(content, options)}\n`,
        );
    };

    if (scriptContent) {
        transformedCode = replacer(scriptContent);
    }

    if (scriptSetupContent) {
        transformedCode = replacer(scriptSetupContent);
    }

    return transformedCode;
}
