import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = () =>
{
    // Estado do editor
    const [editorHtml, setEditorHtml] = useState('');

    // Configuração do editor Quill
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    };

    const handleChange = (html: any) =>{
        setEditorHtml(html);
    };

    // Função para salvar o conteúdo do editor
    const saveContent = () =>
    {
        console.log('Conteúdo salvo:', editorHtml);
    };

    return (
        <div>
            <ReactQuill
                theme="snow"
                value={editorHtml}
                onChange={handleChange}
                modules={modules}
            />
            <button onClick={saveContent}>Salvar Conteúdo</button>
        </div>
    );
};

export default RichTextEditor;
