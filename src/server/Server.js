const request = {
  page: "client/pages/index",
  props: {
    data: [
  {name: 'Dr. Smith', profession: 'Psychiatrist', contact: '1234567890', email: 'drsmith@ccpn.com', photoUrl: 'https://example.com/photo1.jpg'},
    {name: 'Dr. Johnson', profession: 'Therapist', contact: '0987654321', email: 'drjohnson@ccpn.com', photoUrl: 'https://example.com/photo2.jpg'},
    {name: 'Dr. Doe', profession: 'Psychologist', contact: '1122334455', email: 'drdoe@ccpn.com', photoUrl: 'https://example.com/photo3.jpg'},
    {name: 'Dr. Allen', profession: 'Counselor', contact: '6677889900', email: 'drallen@ccpn.com', photoUrl: 'https://example.com/photo4.jpg'}
    // Add more professionals as needed
    ]
  }
}

// const request = {
//   page: "professionalsNetworkLoader"
// }


function doGet(e) {
  const { page, props = {} } = request
  return _R(page, props, { metaData: [{ name: "viewport", content: "width=device-width, initial-scale=1" }] })
}

