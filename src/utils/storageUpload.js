import {
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';

const MB = 1024 * 1024;

export const MAX_PDF_SIZE_MB = 500;

export const formatFileSize = (bytes = 0) => {
  if (bytes >= MB) {
    return `${(bytes / MB).toFixed(1)} MB`;
  }

  return `${Math.ceil(bytes / 1024)} KB`;
};

export const getStorageErrorMessage = (error, maxFileSizeBytes) => {
  const errorCode = error?.code || '';

  if (errorCode === 'storage/unauthorized') {
    return 'Upload blocked by Firebase Storage rules. Check bucket permissions and allowed file size.';
  }

  if (errorCode === 'storage/canceled') {
    return 'Upload was canceled before completion.';
  }

  if (errorCode === 'storage/retry-limit-exceeded') {
    return 'Upload timed out before finishing. Retry once on a stable network.';
  }

  if (errorCode === 'storage/quota-exceeded') {
    return 'Firebase Storage quota has been exceeded for this project.';
  }

  if (errorCode === 'storage/invalid-checksum') {
    return 'Uploaded file checksum did not match. Try the upload again.';
  }

  if (maxFileSizeBytes && error?.serverResponse?.includes('size')) {
    return `Selected PDF exceeds the current ${formatFileSize(maxFileSizeBytes)} upload limit.`;
  }

  return error?.message || 'Upload failed.';
};

export const uploadPdfWithProgress = ({
  file,
  fileRef,
  onProgress,
}) =>
  new Promise((resolve, reject) => {
    const metadata = {
      contentType: file.type || 'application/pdf',
      cacheControl: 'public,max-age=3600',
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    };

    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (!onProgress) {
          return;
        }

        const progress = snapshot.totalBytes
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          : 0;

        onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
