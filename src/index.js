document.body.onload = () => {
	const video = document.querySelector('video');
	const startButton = document.getElementById('start-button');
	const captureButton = document.getElementById('capture-button');

	startButton.addEventListener('click', () => {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				video.srcObject = stream;
				return navigator.mediaDevices.enumerateDevices();
			})
			.then((gotDevices) => {
				// Process for the list of returned devices and get a handle on the video stream
			})
			.catch((error) => {
				console.error('Error accessing media devices.', error);
			});
	});

	captureButton.addEventListener('click', () => {
		const canvas = document.getElementById('canvas');
		const context = canvas.getContext('2d');
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		const imageDataURL = canvas.toDataURL('image/png');
		console.log(imageDataURL);
	});

	// // Load pre-trained model
	// let model;
	// tf.loadLayersModel('file://path_to_your_model/model.json').then(function (
	// 	loadedModel
	// ) {
	// 	model = loadedModel;
	// });
};

// Convert base64 to Tensor
async function base64ToTensor(base64) {
	const image = new Image();
	image.src = 'data:image/png;base64,' + base64;
	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	return tf.browser.fromPixels(canvas).toFloat().expandDims();
}

// Convert Tensor to base64
async function tensorToBase64(tensor) {
	const arrayBuffer = await tf.browser.toPixels(tensor.squeeze());
	const buffer = Buffer.from(arrayBuffer);
	return await sharp(buffer, {
		raw: {
			width: tensor.shape[1],
			height: tensor.shape[2],
			channels: tensor.shape[3],
		},
	})
		.png()
		.toBuffer();
}

// Use the model for segmentation
async function segment(base64Image) {
	let tensorImage = await base64ToTensor(base64Image);
	let segmentedTensor = model.predict(tensorImage);
	let segmentedBase64 = await tensorToBase64(segmentedTensor);
	return segmentedBase64; // Return segmented image in base64 format
}
