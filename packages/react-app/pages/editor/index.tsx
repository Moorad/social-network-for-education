import 'highlight.js/styles/github-dark.css';
import {
	faBold,
	faCode,
	faFeatherPointed,
	faFileImage,
	faHeading,
	faImage,
	faItalic,
	faLink,
	faListOl,
	faListUl,
	faMinus,
	faPaperclip,
	faStrikethrough,
	faTags,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { createPost } from '../../api/postApi';
import Loading from '../../components/Loading';
import MainNavBar from '../../components/NavBars/MainNavBar';
import useAuth from '../../utils/hooks/useAuth';
import ToolbarItem from '../../components/editor/ToolbarItem';
import { marked } from 'marked';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import hljs from 'highlight.js';
import useMarkdownEffects from '../../utils/hooks/useMarkdownEffects';
import { uploadUserImage } from '../../api/userApi';
import { getReadingLevel, getWordCount } from '../../utils/text';
import { formatDigitGrouping } from '../../utils/format';
import useDebounce from '../../utils/hooks/useDebounce';
import AttachmentModal from '../../components/editor/AttachmentModal';
import TagModal from '../../components/editor/TagModal';
import ReferenceModal from '../../components/editor//ReferenceModal';
import { ReferenceType } from 'node-server/routes/utils';
import * as DOMPurify from 'dompurify';
import Button from '../../components/Button';

export type AttachmentType = {
	name: string;
	url: string;
	mime: string;
	size: number;
};

export default function PostEditor() {
	const { fetching, user } = useAuth();
	const router = useRouter();
	const titleRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);
	const effects = useMarkdownEffects(descriptionRef, parseMarkdown);
	const markdownPreviewRef = useRef<HTMLDivElement>(null);
	const fileRef = useRef<HTMLInputElement>(null);
	const queryClient = useQueryClient();
	const [view, setView] = useState<'text' | 'md'>('text');
	const [wordCount, setWordCount] = useState(0);
	const wordCountDebounce = useDebounce(wordCount, 800);
	const [readingLevel, setReadingLevel] = useState('');
	const readingLevelDebounce = useDebounce(readingLevel, 800);
	const [modalOpenStates, setModalOpenStates] = useState([
		false,
		false,
		false,
	]);
	const [tags, setTags] = useState<string[]>([]);
	const [attachments, setAttachments] = useState<AttachmentType[]>([]);
	const [references, setReferences] = useState<ReferenceType[]>([]);

	const uploadMutation = useMutation(uploadUserImage, {
		onSuccess: (res) => {
			effects.image(res.url);
		},
		onError: () => {
			toast.error('Failed to upload image');
		},
	});

	marked.setOptions({
		breaks: true,
		headerIds: false,
		highlight: (code, lang) => {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';

			return hljs.highlight(code, { language }).value;
		},
		langPrefix: 'hljs language-',
	});

	const postMutation = useMutation('create_post', createPost, {
		onSuccess: () => {
			queryClient.invalidateQueries();
			router.push('/profile');
		},
		onError: () => {
			toast.error('Failed to create a new post');
		},
	});

	function handleSubmission() {
		if (titleRef.current && descriptionRef.current) {
			postMutation.mutate({
				title: titleRef.current.value,
				description: descriptionRef.current.value,
				attachments: attachments,
				tags: tags,
				references: references,
			});
		}
	}

	function parseMarkdown() {
		if (descriptionRef.current && markdownPreviewRef.current) {
			markdownPreviewRef.current.innerHTML = DOMPurify.sanitize(
				marked.parse(descriptionRef.current.value)
			);
			setWordCount(
				getWordCount(markdownPreviewRef.current.innerText || '')
			);
			setReadingLevel(
				getReadingLevel(markdownPreviewRef.current.innerText || '')
			);
		}
	}

	function switchTextView() {
		if (view == 'text') {
			setView('md');
		} else {
			setView('text');
		}
	}

	function imageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			const formData = new FormData();

			formData.append('file', e.target.files[0]);

			uploadMutation.mutate({
				formData: formData,
				_for: 'Other_Image',
			});
		}
	}

	useEffect(() => {
		if (descriptionRef.current && markdownPreviewRef.current) {
			if (view == 'text') {
				markdownPreviewRef.current.classList.add('hidden');
				descriptionRef.current.classList.remove('hidden');
			}

			if (view == 'md') {
				markdownPreviewRef.current.classList.remove('hidden');
				descriptionRef.current.classList.add('hidden');
			}
		}
	}, [view]);

	if (fetching) {
		return <Loading />;
	}

	return (
		<MainNavBar>
			<div className='w-4/5 h-full mx-auto p-5 flex flex-col'>
				<input
					type='file'
					onChange={(e) => imageUpload(e)}
					ref={fileRef}
					accept='.png,.jpg,.jpeg'
					className='hidden'
				/>
				<AttachmentModal
					isOpen={modalOpenStates[0]}
					setIsOpen={(state) =>
						setModalOpenStates([state, false, false])
					}
					attachments={attachments}
					setAttachments={setAttachments}
				/>
				<TagModal
					isOpen={modalOpenStates[1]}
					setIsOpen={(state: boolean) =>
						setModalOpenStates([false, state, false])
					}
					tags={tags}
					setTags={setTags}
				/>
				<ReferenceModal
					isOpen={modalOpenStates[2]}
					setIsOpen={(state: boolean) =>
						setModalOpenStates([false, false, state])
					}
					references={references}
					setReferences={setReferences}
				/>

				<div className='flex items-center gap-4'>
					<img src={user?.avatar} className='w-9 rounded-full' />
					<div className='text-gray-700 font-medium text-lg'>
						{user?.displayName}
					</div>
				</div>
				<div className='text-4xl font-bold text-gray-900 my-1'>
					<input
						type='text'
						placeholder='New post title here...'
						className='py-4 w-full outline-0'
						ref={titleRef}
					/>
				</div>
				<div className='flex justify-between my-4'>
					<div className='flex gap-10'>
						<div className='flex gap-2'>
							<ToolbarItem
								icon={faBold}
								onMouseDown={() =>
									effects.wrappingEffect('bold')
								}
							/>
							<ToolbarItem
								icon={faItalic}
								onMouseDown={() =>
									effects.wrappingEffect('italic')
								}
							/>
							<ToolbarItem
								icon={faStrikethrough}
								onMouseDown={() =>
									effects.wrappingEffect('strikethrough')
								}
							/>
						</div>
						<div className='flex gap-2'>
							<ToolbarItem
								icon={faCode}
								onMouseDown={() => effects.codeBlock()}
							/>
							<ToolbarItem
								icon={faLink}
								onMouseDown={() => effects.link()}
							/>
							<ToolbarItem
								icon={faImage}
								onMouseDown={() => effects.image()}
							/>
							<ToolbarItem
								icon={faFileImage}
								onMouseDown={() => fileRef.current?.click()}
							/>
						</div>
						<div className='flex gap-2'>
							<ToolbarItem
								icon={faHeading}
								onMouseDown={() => effects.heading()}
							/>
							<ToolbarItem
								icon={faMinus}
								onMouseDown={() => effects.HR()}
							/>
							<ToolbarItem
								icon={faListUl}
								onMouseDown={() => effects.unorderList()}
							/>
							<ToolbarItem
								icon={faListOl}
								onMouseDown={() => effects.orderedList()}
							/>
						</div>
					</div>
					<div className='flex gap-2'>
						<ToolbarItem
							icon={faTags}
							className='bg-rose-200 text-rose-800 hover:bg-rose-300'
							badgeValue={tags.length}
							badgeClassName='text-white bg-rose-500'
							onClick={() => {
								setModalOpenStates([false, true, false]);
							}}
						/>
						<ToolbarItem
							icon={faFeatherPointed}
							className='bg-orange-200 text-orange-800 hover:bg-orange-300'
							badgeValue={references.length}
							badgeClassName='text-white bg-orange-500'
							onClick={() => {
								setModalOpenStates([false, false, true]);
							}}
						/>
						<div className='flex font-bold'>
							<ToolbarItem
								icon={faPaperclip}
								className='bg-indigo-200 text-indigo-800 hover:bg-indigo-300'
								badgeValue={attachments.length}
								badgeClassName='text-white bg-indigo-500'
								onClick={() => {
									setModalOpenStates([true, false, false]);
								}}
							/>
						</div>
						<ToolbarItem
							icon={faMarkdown}
							className='bg-gray-900 text-gray-50 hover:bg-gray-800'
							onClick={switchTextView}
						/>
					</div>
				</div>
				<div className='mb-3'>
					{view == 'text' ? (
						<span className='bg-gray-200 text-gray-900 py-1 px-3 rounded-sm'>
							Text view
						</span>
					) : (
						<span className='bg-gray-900 text-white py-1 px-3 rounded-sm'>
							Markdown view
						</span>
					)}
				</div>
				<div className='flex-grow text-lg relative'>
					<textarea
						className=' h-full w-full outline-0 border border-gray-200 p-4 rounded-md'
						placeholder='Text description...'
						ref={descriptionRef}
						onChange={parseMarkdown}
					></textarea>
					<div
						className='w-full h-full whitespace-pre-wrap leading-none hidden markdown'
						ref={markdownPreviewRef}
					></div>
				</div>
				<div className='flex gap-5 py-5 justify-between'>
					<div className='text-gray-400'>
						{formatDigitGrouping(wordCountDebounce)} words •{' '}
						{readingLevelDebounce}
					</div>
					<div className='flex gap-5'>
						<Button
							variant='danger'
							onClick={() => {
								const confirmation = confirm(
									'The post information will be lost. Are you sure you want to do this?'
								);

								if (confirmation) {
									router.push('/home');
								}
							}}
						>
							Discard
						</Button>
						<Button variant='primary' onClick={handleSubmission}>
							Post
						</Button>
					</div>
				</div>
			</div>
		</MainNavBar>
	);
}
