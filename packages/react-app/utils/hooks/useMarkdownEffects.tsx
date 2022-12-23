import { RefObject } from 'react';

const wrappingEffects = {
	bold: '**',
	italic: '*',
	strikethrough: '~',
	// inlineCode: '`'
};

export default function useMarkdownEffects(textAreaRef: RefObject<HTMLTextAreaElement>, markdownRender: () => void) {
	return {
		apply: {
			wrappingEffect: (option: keyof typeof wrappingEffects) => applyCustomEffect(textAreaRef, markdownRender, (selection, start, end, text) => {
				return text.slice(0, start)
					+ wrappingEffects[option] + selection
					+ wrappingEffects[option] + text.slice(end);
			}),
			codeBlock: () => applyCustomEffect(textAreaRef, markdownRender, (selection, start, end, text) => {
				return text.slice(0, start) + '\n```plaintext\n' + selection + '\n```\n' + text.slice(end);
			}),
			heading: () => applyCustomEffect(textAreaRef, markdownRender, (selection, start, end, text) => {
				const newLinePosition = text.slice(0, start).lastIndexOf('\n');
				let insertChar = '# ';

				if (text.slice(newLinePosition + 1, newLinePosition + 5) == '####') {
					return text;
				}

				if (text[newLinePosition + 1] == '#') {
					insertChar = '#';
				}

				return text.slice(0, newLinePosition + 1) + insertChar + text.slice(newLinePosition + 1);
			}),
			HR: () => applyCustomEffect(textAreaRef, markdownRender, (selection, start, end, text) => {
				return text.slice(0, start) + '\n\n---\n\n' + text.slice(end);
			}),
			orderedList: () => applyCustomEffect(textAreaRef, markdownRender, (selection, start, end, text) => {
				const newLinePosition = text.slice(0, start).lastIndexOf('\n');
				const regexMatches = text.match(/(\d+). /g);
				let digit = 1;

				if (regexMatches != null) {
					digit = Number(regexMatches[regexMatches.length - 1].split('.')[0]) + 1;
				}

				return text.slice(0, newLinePosition + 1) + digit + '. ' + text.slice(newLinePosition + 1);
			}),
			unorderList: () => applyCustomEffect(textAreaRef, markdownRender, (selection, start, end, text) => {
				const newLinePosition = text.slice(0, start).lastIndexOf('\n');

				if (text[newLinePosition + 1] == '-') {
					return text;
				}

				return text.slice(0, newLinePosition + 1) + '- ' + text.slice(newLinePosition + 1);
			}),
			link: () => applyCustomEffect(textAreaRef, markdownRender, (selection, start, end, text) => {
				return text.slice(0, start) + '[' + selection + '](url)' + text.slice(end);
			}),
			image: (url?: string) => applyCustomEffect(textAreaRef, markdownRender, (selection, start, end, text) => {
				return text.slice(0, start) + `![alternative text](${url ?? 'url'})` + text.slice(end);
			})
		},
		get: {
			selectionStart: () => getSelectionStart(textAreaRef),
		}
	};
}


function applyCustomEffect(textAreaRef: RefObject<HTMLTextAreaElement>, markdownRender: () => void, customiseEffect: (selection: string, selectionStart: number, selectionEnd: number, textAreaText: string) => string) {
	const selectionText = window.getSelection()?.toString();

	if (textAreaRef.current) {
		const textAreaValue = textAreaRef.current.value;
		const selectionStart = textAreaRef.current.selectionStart;
		const selectionEnd = textAreaRef.current.selectionEnd;

		textAreaRef.current.value = customiseEffect(selectionText ?? '', selectionStart, selectionEnd, textAreaValue);

		// Manual markdown render trigger
		markdownRender();
	}
}

function getSelectionStart(textAreaRef: RefObject<HTMLTextAreaElement>) {
	if (textAreaRef.current) {
		return textAreaRef.current.selectionStart;
	}
}