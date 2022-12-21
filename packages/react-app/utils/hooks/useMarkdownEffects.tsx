import { RefObject } from 'react';

const wrappingEffects = {
	bold: '**',
	italic: '*',
	strikethrough: '~',
	// inlineCode: '`'
};

const headings = {
	h1: '# ',
	h2: '## ',
	h3: '### ',
	h4: '#### ',
	h5: '##### ',

};

export default function useMarkdownEffects(textAreaRef: RefObject<HTMLTextAreaElement>, markdownRender: () => void) {
	return {
		applyWrappingEffect: (option: keyof typeof wrappingEffects) => applyCustomEffect(textAreaRef, markdownRender, (selection) => wrappingEffects[option] + selection + wrappingEffects[option]),
		applyCodeBlock: () => applyCustomEffect(textAreaRef, markdownRender, (selection) => '\n```plaintext\n' + selection + '\n```\n')
	};
}


function applyCustomEffect(textAreaRef: RefObject<HTMLTextAreaElement>, markdownRender: () => void, customiseEffect: (selection: string) => string) {
	const selectionText = window.getSelection()?.toString();

	if (textAreaRef.current && selectionText) {
		const textAreaValue = textAreaRef.current.value;
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		textAreaRef.current.value = textAreaValue.slice(0, selectionStart)
			+ customiseEffect(selectionText)
			+ textAreaValue.slice(selectionEnd);

		// Manual markdown render trigger
		markdownRender();
	}
}