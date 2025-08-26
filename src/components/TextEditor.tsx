import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "../Hooks/useTheme";

const media_url = process.env.REACT_APP_WHIZ_MEDIA_URL || "";
const ImageUpload = process.env.REACT_APP_ONEADMIN_API || "";

interface TinyEditorProps {
  data: string;
  handleEditorChange: (content: string) => void;
  darkMode?: boolean; // Optional prop for dark mode (for backward compatibility)
}

export const TinyEditor: React.FC<TinyEditorProps> = ({ 
  data: initialData, 
  handleEditorChange, 
  darkMode 
}) => {
  const [data, setData] = useState<string>(initialData);
  const { isDark: systemIsDark } = useTheme();
  
  // Use provided darkMode prop if available, otherwise fall back to system preference
  const shouldUseDarkMode = darkMode !== undefined ? darkMode : systemIsDark;
  
  const [currentTheme, setCurrentTheme] = useState<{
    skin: string;
    contentCss: string;
  }>({
    skin: shouldUseDarkMode ? "oxide-dark" : "oxide",
    contentCss: shouldUseDarkMode ? "dark" : "default"
  });

  // Update theme when darkMode prop or system preference changes
  useEffect(() => {
    setCurrentTheme({
      skin: shouldUseDarkMode ? "oxide-dark" : "oxide",
      contentCss: shouldUseDarkMode ? "dark" : "default"
    });
  }, [shouldUseDarkMode]);

  // Custom image upload handler
  const image_upload_handler_callback = (
    blobInfo: any,
    progress: (percent: number) => void
  ): Promise<string> =>
    new Promise((resolve, reject) => {
      const basefile = blobInfo.base64();
      const filetype = blobInfo.blob().type;
      const file = `data:${filetype};base64,${basefile}`;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open("POST", `${ImageUpload}/s3-file-upload`);

      xhr.upload.onprogress = (e: ProgressEvent) => {
        if (e.lengthComputable) {
          progress((e.loaded / e.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 403) {
          reject({ message: "HTTP Error: " + xhr.status, remove: true });
          return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
          reject("HTTP Error: " + xhr.status);
          return;
        }
        try {
          const json = JSON.parse(xhr.responseText);
          if (!json || typeof json.url !== "string") {
            reject("Invalid JSON: " + xhr.responseText);
            return;
          }
          const return_url = `${media_url}/website/${json.url}`;
          resolve(return_url);
        } catch (err) {
          reject("Invalid response: " + xhr.responseText);
        }
      };

      xhr.onerror = () => {
        reject("Image upload failed due to a XHR Transport error. Code: " + xhr.status);
      };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fs3folderpath", "website/");
      xhr.send(formData);
    });

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      // licenseKey="gpl"
      onEditorChange={(content: string, _editor: any) => {
        setData(content);
        handleEditorChange(content);
      }}
      value={data}
      init={{
        skin: currentTheme.skin,
        content_css: currentTheme.contentCss,
        menubar: false,
        max_height: 400,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "autoresize",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
          "codesample",
          "code",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help | codesample | code | image | link | fullscreen | media",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
        autosave_ask_before_unload: true,
        auto_focus: "auto",
        autosave_interval: "30s",
        autosave_restore_when_empty: false,
        autosave_retention: "2m",
        image_advtab: true,
        importcss_append: true,
        image_caption: true,
        quickbars_selection_toolbar:
          "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
        noneditable_class: "mceNonEditable",
        toolbar_mode: "sliding",
        contextmenu: "link image table",
        images_upload_url: `${ImageUpload}/s3-file-upload`,
        images_upload_credentials: true,
        images_upload_handler: image_upload_handler_callback,
      }}
    />
  );
};
