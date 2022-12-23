import 'highlight.js/styles/github-dark.css';
import { faBold, faCode, faFileImage, faHeading, faImage, faItalic, faLink, faListOl, faListUl, faMinus, faStrikethrough } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { createPost } from '../../api/postApi';
import Loading from '../../components/Loading';
import MainNavBar from '../../components/NavBars/MainNavBar';
import useAuth from '../../utils/hooks/useAuth';
import ToolbarItem from './components/ToolbarItem';
import { marked } from 'marked';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import hljs from 'highlight.js';
import useMarkdownEffects from '../../utils/hooks/useMarkdownEffects';
import { uploadUserImage } from '../../api/userApi';

export default function PostEditor() {
	const { fetching, user } = useAuth();
	const router = useRouter();
	const titleRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);
	const markdownPreviewRef = useRef<HTMLDivElement>(null);
	const selectionStartRef = useRef(0);
	const fileRef = useRef<HTMLInputElement>(null);
	const queryClient = useQueryClient();
	const [view, setView] = useState<'text' | 'md'>('text');
	const { apply, get } = useMarkdownEffects(descriptionRef, parseMarkdown);

	const uploadMutation = useMutation(uploadUserImage, {
		onSuccess: (res) => {
			apply.image(res.url);
		},
		onError: () => {
			toast.error('Failed to upload image');
		}
	});


	marked.setOptions({
		breaks: true,
		headerIds: false,
		highlight: (code, lang) => {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';

			return hljs.highlight(code, { language }).value;
		},
		langPrefix: 'hljs language-'
	});

	const postMutation = useMutation('create_post', createPost, {
		onSuccess: () => {
			queryClient.invalidateQueries();
			router.push('/profile');
		},
		onError: () => {
			toast.error('Failed to create a new post');
		}
	});

	function handleSubmission() {
		if (titleRef.current && descriptionRef.current) {
			postMutation.mutate({
				title: titleRef.current.value,
				description: descriptionRef.current.value
			});
		}
	}

	function parseMarkdown() {
		if (descriptionRef.current && markdownPreviewRef.current) {
			markdownPreviewRef.current.innerHTML = marked.parse(descriptionRef.current.value);
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
			const imageFile = e.target.files[0];

			const formData = new FormData();

			formData.append('file', imageFile);

			uploadMutation.mutate({
				formData: formData,
				_for: 'Other_Image'
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
				<div className='flex items-center gap-4'>
					<img src={user?.avatar} className='w-9 rounded-full' />
					<div className='text-gray-700 font-medium text-lg'>{user?.displayName}</div>
				</div>
				<div className='text-4xl font-bold text-gray-900 my-1'>
					<input type='text' placeholder='New post title here...' className='py-4 w-full outline-0' ref={titleRef} />
				</div>
				<div className='flex justify-between my-4'>
					<div className='flex gap-10'>
						<div className='flex gap-2'>
							<ToolbarItem icon={faBold} onMouseDown={() => apply.wrappingEffect('bold')} />
							<ToolbarItem icon={faItalic} onMouseDown={() => apply.wrappingEffect('italic')} />
							<ToolbarItem icon={faStrikethrough} onMouseDown={() => apply.wrappingEffect('strikethrough')} />
						</div>
						<div className='flex gap-2'>
							<ToolbarItem icon={faCode} onMouseDown={() => apply.codeBlock()} />
							<ToolbarItem icon={faLink} onMouseDown={() => apply.link()} />
							<ToolbarItem icon={faImage} onMouseDown={() => apply.image()} />
							<ToolbarItem icon={faFileImage} onMouseDown={() => {
								selectionStartRef.current = get.selectionStart() || 0;
								fileRef.current?.click();
							}} />

						</div>
						<div className='flex gap-2'>
							<ToolbarItem icon={faHeading} onMouseDown={() => apply.heading()} />
							<ToolbarItem icon={faMinus} onMouseDown={() => apply.HR()} />
							<ToolbarItem icon={faListUl} onMouseDown={() => apply.unorderList()} />
							<ToolbarItem icon={faListOl} onMouseDown={() => apply.orderedList()} />
						</div>
					</div>
					<div className='flex'>
						<ToolbarItem icon={faMarkdown} className='bg-gray-900 text-gray-50' onClick={switchTextView} />
					</div>
				</div>
				<div className='flex-grow text-lg relative'>
					<textarea className=' h-full w-full outline-0 border border-gray-200 p-4 rounded-md' placeholder='Text description...' ref={descriptionRef} onChange={parseMarkdown}></textarea>
					<div className='w-full h-full whitespace-pre-wrap leading-none hidden' ref={markdownPreviewRef}></div>
				</div>
				<div></div>
				<div className='flex gap-5 py-5 flex-row-reverse'>
					<button className='bg-blue-500 py-2 px-5 rounded text-white' onClick={handleSubmission}>Post</button>
					<button className='bg-red-500 py-2 px-5 rounded text-white'>Discard</button>
				</div>
			</div>
		</MainNavBar >
	);
}
