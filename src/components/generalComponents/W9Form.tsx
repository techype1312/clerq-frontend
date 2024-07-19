import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const W9Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    // Add other W9 form fields here
  });

  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const createPdf = async () => {
    try {
      const formUrl = "/fw9.pdf";
      const formPdfBytes = await fetch(formUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(formPdfBytes);

      const form = pdfDoc.getForm();
      console.log(form.getFields(), form.getFields()[22].getName());
      const nameField = form.getTextField(
        "topmostSubform[0].Page1[0].f1_01[0]"
      );
      // const ageField = form.getTextField('Age');
      // const heightField = form.getTextField('Height');
      // const weightField = form.getTextField('Weight');
      // const eyesField = form.getTextField('Eyes');
      // const skinField = form.getTextField('Skin');
      // const hairField = form.getTextField('Hair');

      // // Step 3: Set values for the form fields.
      nameField.setText("Test user");
      // ageField.setText('24 years');
      // heightField.setText(`5' 1"`);
      // weightField.setText('196 lbs');
      // eyesField.setText('blue');
      // skinField.setText('white');
      // hairField.setText('brown');

      // Step 4: Save the modified PDF.
      const pdfBytes = await pdfDoc.save();

      // Step 5: Create a `Blob` from the PDF bytes,
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Step 6: Create a download URL for the `Blob`.
      const url = URL.createObjectURL(blob);

      // Step 7: Create a link element and simulate a click event to trigger the download.
      const link = document.createElement("a");
      link.href = url;
      link.download = "w9_filled.pdf";
      link.click();
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      createPdf();
      //   const response = await axios.post('/api/w9', formData);
      //   console.log('Data submitted successfully:', response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for user input */}
      <button type="submit">{downloadUrl ? "Download W9" : "Submit W9"}</button>
      {downloadUrl && <a href={downloadUrl}>Download Link</a>}
      <button onClick={createPdf}>Fill Form</button>
    </form>
  );
};

export default W9Form;
