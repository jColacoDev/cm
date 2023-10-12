/* eslint-disable no-unused-vars */
import React from 'react'
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop'
import './Landing.scss'

export default function Landing() {
    const [selectedFiles, setSelectedFiles] = React.useState([]);

    function onFilesChange(files){
		setSelectedFiles(files);
	}

    function onSubmit(e) {
        e.preventDefault();
      
        const selectedFilesArray = [...selectedFiles];
        const htmlFile = selectedFilesArray.find((file) => file.name.endsWith(".html"));
        const cssFiles = selectedFilesArray.filter((file) => file.name.endsWith(".css"));
      
        if (htmlFile && cssFiles.length > 0) {
          const htmlReader = new FileReader();
          htmlReader.onload = () => {
            const htmlContent = htmlReader.result;
      
            const cssReaders = cssFiles.map(() => new FileReader());
            const cssContents = [];
      
            cssReaders.forEach((cssReader, i) => {
              cssReader.onload = () => {
                cssContents.push(cssReader.result);
      
                if (cssContents.length === cssFiles.length) {
                  const requestBody = {
                    html: htmlContent,
                    css: cssContents,
                  };
      
                  // Continue with the fetch request here
                  fetch("http://localhost:8000/uploadCV", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                  })
                    .then((res) => res.blob())
                    .then((pdfBlob) => {
                      // Create a blob URL from the received PDF
                      const blobUrl = URL.createObjectURL(pdfBlob);
      
                      // Open the PDF in a new browser tab
                      window.open(blobUrl, "_blank");
                    })
                    .catch((err) => {
                      console.error(`Error occurred: ${err}`);
                    });
                }
              };
              cssReader.readAsText(cssFiles[i]);
            });
          };
      
          htmlReader.readAsText(htmlFile);
        } else {
          console.error("Both HTML and CSS files are required.");
        }
      }
      

	// function onDownload(e){
    //     e.preventDefault();

	// 	const formData = new FormData();
	// 	Array.from(selectedFiles).forEach(file => {
	// 		formData.append("files", file);
	// 		console.log(file);
	// 	});

	// 	fetch("http://localhost:5000/pdf", {
	// 		method: 'POST',
	// 		body: formData
	// 	})
	// 		.then((res) => {
	// 			console.log(res)
	// 		})
	// 		.catch((err) => (`Error occured: ${err}`));
	// }

    const iframeStyle = {
        height: '300mm',
        width: '300mm',
        maxWidth: '100%'
      };
    
  return (
    <div>
        <div className="header">
            <figure className='logo'></figure>
            <h2>HTML + CSS to A4 sized PDF generator</h2>
        </div>
        <ul className='tasks'>
            <li>Create one HTML file with the PDF structure</li>
            <li>Create one or more CSS files for styling the PDF</li>
            <li>The component is sized width:210mm & height:297mm for A4 output</li>
            <li>Upload all files at once to receive the result PDF in another tab, for a preview and download.</li>
        </ul>
        <DragAndDrop onSubmit={onSubmit} onFilesChange={onFilesChange}></DragAndDrop>
        <br />
        <br />
        <h3>HTML + CSS CV Template in Code Pen</h3>

        <iframe
        title="CV template1"
        src="https://codepen.io/jcolacodev/embed/bGKOjPr?default-tab=html%2Cresult"
        frameBorder="0"
        scrolling="no"
        loading="lazy"
        allowFullScreen
        allow="encrypted-media"
        style={iframeStyle}
      >
        See the Pen{' '}
        <a href="https://codepen.io/jcolacodev/pen/bGKOjPr" target="_blank" rel="noopener noreferrer">
          CV template1
        </a>{' '}
        by jColacoDev{' '}
        (<a href="https://codepen.io/jcolacodev/" target="_blank" rel="noopener noreferrer">@jcolacodev</a>) on{' '}
        <a href="https://codepen.io" target="_blank" rel="noopener noreferrer">
          CodePen
        </a>
        .
      </iframe>
    </div>
  )
}
