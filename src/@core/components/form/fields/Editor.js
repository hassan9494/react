import { FormGroup, Label } from 'reactstrap'
import { Controller } from 'react-hook-form'
import { Editor } from 'react-draft-wysiwyg'
import '@styles/react/libs/editor/editor.scss'
import { EditorState, ContentState, convertFromHTML, convertToRaw  } from 'draft-js'
import { useEffect, useState } from 'react'
import draftToHtml from 'draftjs-to-html'

const EditorField = ({ form, name, label, rules = {}, list = [], ...props }) => {


    const [editorState, setEditorState] = useState(null)

    return (
        <FormGroup>
            {
                label &&
                <Label>{label}</Label>
            }
            <Controller
                control={form.control}
                name={name}
                innerRef={form.register(rules)}
                invalid={form.errors[name] && true}
                render={
                    ({ value, onChange }) => {
                        if (!editorState && typeof value === 'string') {
                            value = value.replaceAll('<iframe', '<span')
                            value = value.replaceAll('</iframe>', 'Video</span>')
                            setEditorState(
                                EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(value)))
                            )
                            setTimeout(() => {
                                // document.body.innerHTML = document.body.innerHTML.replace('hello', 'hi');
                            }, 1000)
                        }
                        return (
                            <Editor
                                editorState={editorState}
                                onEditorStateChange={data => {
                                    setEditorState(data)
                                    onChange(draftToHtml(convertToRaw(data.getCurrentContent())))
                                }}
                                toolbar={{
                                    link: {
                                        linkCallback: params => ({ ...params })
                                    },
                                    embedded: {
                                        embedCallback:  (link) => {
                                            if (link.indexOf("youtube") >= 0) {
                                                link = link.replace("watch?v=", "embed/")
                                                link = link.replace("/watch/", "/embed/")
                                                link = link.replace("youtu.be/", "youtube.com/embed/")
                                            }
                                            return link
                                        }
                                    }
                                }}
                            />
                        )
                    }
                }
            />
        </FormGroup>
    )
}

export default EditorField
