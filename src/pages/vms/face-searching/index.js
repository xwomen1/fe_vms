  import React, { useState } from 'react';
  import { Grid, Paper, IconButton, TextField, Autocomplete, Button, Typography, CardContent, Card, Box } from '@mui/material';
  import ImageForm from './popup/image-popup'; // Import ImageForm
  import Icon from 'src/@core/components/icon';
  import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from '@mui/lab';

  const cameras = [
    { title: 'Camera 1' },
    { title: 'Camera 2' },
    { title: 'Camera 3' },

    // Thêm các camera khác tại đây
  ];

  const fakeData = [
    {
      "id": "cb029640-1e8b-4009-9def-62093be66e6d",
      "description": "Phát hiện người đi qua",
      "timestamp": 1730111251603,
      "timeStart": 1730111258579,
      "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
      "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
      "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
      "storageBucket": "traffic-ai-engine",
      "eventType": "AI_EVENT_PERSON_RECOGNITION",
      "camName": "MCL12D_AF_C3",
      "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
      "memberID": "PID 25557 | 5438807",
      "createdAt": "2024-10-28T10:27:39.716697Z",
      "updatedAt": "2024-10-28T10:27:39.716697Z",
      "deletedMark": false,
      "deletedAt": "0001-01-01T00:00:00Z",
      "longtitudeOfCam": 105.9101839240255,
      "latitudeOfCam": 21.047448929910566,
      "eventTypeString": "Sự kiện AI chưa phân loại",
      "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
      "status": "NEW",
      "converTimestamp": "2024-10-28T10:27:31.603Z",
      "cabinID": "00000000-0000-0000-0000-000000000000",
      "result": "PID 25557 | 5438807"
  },
  {
      "id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
      "description": "Phát hiện người đi qua",
      "timestamp": 1730111250834,
      "timeStart": 1730111259580,
      "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
      "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
      "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
      "storageBucket": "traffic-ai-engine",
      "eventType": "AI_EVENT_PERSON_RECOGNITION",
      "camName": "MCL12D_AF_C3",
      "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
      "memberID": "PID 25560 | 5438807",
      "createdAt": "2024-10-28T10:27:40.617222Z",
      "updatedAt": "2024-10-28T10:27:40.617222Z",
      "deletedMark": false,
      "deletedAt": "0001-01-01T00:00:00Z",
      "longtitudeOfCam": 105.9101839240255,
      "latitudeOfCam": 21.047448929910566,
      "eventTypeString": "Sự kiện AI chưa phân loại",
      "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
      "status": "NEW",
      "converTimestamp": "2024-10-28T10:27:30.834Z",
      "cabinID": "00000000-0000-0000-0000-000000000000",
      "result": "PID 25560 | 5438807"
  },
  {
      "id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
      "description": "Phát hiện người đi qua",
      "timestamp": 1730111247422,
      "timeStart": 1730111260581,
      "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
      "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
      "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
      "storageBucket": "traffic-ai-engine",
      "eventType": "AI_EVENT_PERSON_RECOGNITION",
      "camName": "MCL12D_AF_C1",
      "cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
      "memberID": "PID 25556 | 5427219",
      "createdAt": "2024-10-28T10:27:41.516926Z",
      "updatedAt": "2024-10-28T10:27:41.516926Z",
      "deletedMark": false,
      "deletedAt": "0001-01-01T00:00:00Z",
      "longtitudeOfCam": 105.9101839240255,
      "latitudeOfCam": 21.047448929910566,
      "eventTypeString": "Sự kiện AI chưa phân loại",
      "location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
      "status": "NEW",
      "converTimestamp": "2024-10-28T10:27:27.422Z",
      "cabinID": "00000000-0000-0000-0000-000000000000",
      "result": "PID 25556 | 5427219"
  },
  {
    "id": "cb029640-1e8b-4009-9def-62093be66e6d",
    "description": "Phát hiện người đi qua",
    "timestamp": 1730111251603,
    "timeStart": 1730111258579,
    "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
    "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
    "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
    "storageBucket": "traffic-ai-engine",
    "eventType": "AI_EVENT_PERSON_RECOGNITION",
    "camName": "MCL12D_AF_C3",
    "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
    "memberID": "PID 25557 | 5438807",
    "createdAt": "2024-10-28T10:27:39.716697Z",
    "updatedAt": "2024-10-28T10:27:39.716697Z",
    "deletedMark": false,
    "deletedAt": "0001-01-01T00:00:00Z",
    "longtitudeOfCam": 105.9101839240255,
    "latitudeOfCam": 21.047448929910566,
    "eventTypeString": "Sự kiện AI chưa phân loại",
    "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
    "status": "NEW",
    "converTimestamp": "2024-10-28T10:27:31.603Z",
    "cabinID": "00000000-0000-0000-0000-000000000000",
    "result": "PID 25557 | 5438807"
},
{
    "id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
    "description": "Phát hiện người đi qua",
    "timestamp": 1730111250834,
    "timeStart": 1730111259580,
    "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
    "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
    "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
    "storageBucket": "traffic-ai-engine",
    "eventType": "AI_EVENT_PERSON_RECOGNITION",
    "camName": "MCL12D_AF_C3",
    "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
    "memberID": "PID 25560 | 5438807",
    "createdAt": "2024-10-28T10:27:40.617222Z",
    "updatedAt": "2024-10-28T10:27:40.617222Z",
    "deletedMark": false,
    "deletedAt": "0001-01-01T00:00:00Z",
    "longtitudeOfCam": 105.9101839240255,
    "latitudeOfCam": 21.047448929910566,
    "eventTypeString": "Sự kiện AI chưa phân loại",
    "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
    "status": "NEW",
    "converTimestamp": "2024-10-28T10:27:30.834Z",
    "cabinID": "00000000-0000-0000-0000-000000000000",
    "result": "PID 25560 | 5438807"
},
{
    "id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
    "description": "Phát hiện người đi qua",
    "timestamp": 1730111247422,
    "timeStart": 1730111260581,
    "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
    "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
    "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
    "storageBucket": "traffic-ai-engine",
    "eventType": "AI_EVENT_PERSON_RECOGNITION",
    "camName": "MCL12D_AF_C1",
    "cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
    "memberID": "PID 25556 | 5427219",
    "createdAt": "2024-10-28T10:27:41.516926Z",
    "updatedAt": "2024-10-28T10:27:41.516926Z",
    "deletedMark": false,
    "deletedAt": "0001-01-01T00:00:00Z",
    "longtitudeOfCam": 105.9101839240255,
    "latitudeOfCam": 21.047448929910566,
    "eventTypeString": "Sự kiện AI chưa phân loại",
    "location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
    "status": "NEW",
    "converTimestamp": "2024-10-28T10:27:27.422Z",
    "cabinID": "00000000-0000-0000-0000-000000000000",
    "result": "PID 25556 | 5427219"
},
{
  "id": "cb029640-1e8b-4009-9def-62093be66e6d",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111251603,
  "timeStart": 1730111258579,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C3",
  "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
  "memberID": "PID 25557 | 5438807",
  "createdAt": "2024-10-28T10:27:39.716697Z",
  "updatedAt": "2024-10-28T10:27:39.716697Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:31.603Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25557 | 5438807"
},
{
  "id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111250834,
  "timeStart": 1730111259580,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C3",
  "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
  "memberID": "PID 25560 | 5438807",
  "createdAt": "2024-10-28T10:27:40.617222Z",
  "updatedAt": "2024-10-28T10:27:40.617222Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:30.834Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25560 | 5438807"
},
{
  "id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111247422,
  "timeStart": 1730111260581,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C1",
  "cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
  "memberID": "PID 25556 | 5427219",
  "createdAt": "2024-10-28T10:27:41.516926Z",
  "updatedAt": "2024-10-28T10:27:41.516926Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:27.422Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25556 | 5427219"
},
{
  "id": "cb029640-1e8b-4009-9def-62093be66e6d",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111251603,
  "timeStart": 1730111258579,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C3",
  "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
  "memberID": "PID 25557 | 5438807",
  "createdAt": "2024-10-28T10:27:39.716697Z",
  "updatedAt": "2024-10-28T10:27:39.716697Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:31.603Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25557 | 5438807"
},
{
  "id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111250834,
  "timeStart": 1730111259580,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C3",
  "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
  "memberID": "PID 25560 | 5438807",
  "createdAt": "2024-10-28T10:27:40.617222Z",
  "updatedAt": "2024-10-28T10:27:40.617222Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:30.834Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25560 | 5438807"
},
{
  "id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111247422,
  "timeStart": 1730111260581,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C1",
  "cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
  "memberID": "PID 25556 | 5427219",
  "createdAt": "2024-10-28T10:27:41.516926Z",
  "updatedAt": "2024-10-28T10:27:41.516926Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:27.422Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25556 | 5427219"
},
{
"id": "cb029640-1e8b-4009-9def-62093be66e6d",
"description": "Phát hiện người đi qua",
"timestamp": 1730111251603,
"timeStart": 1730111258579,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25557 | 5438807",
"createdAt": "2024-10-28T10:27:39.716697Z",
"updatedAt": "2024-10-28T10:27:39.716697Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:31.603Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25557 | 5438807"
},
{
"id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
"description": "Phát hiện người đi qua",
"timestamp": 1730111250834,
"timeStart": 1730111259580,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25560 | 5438807",
"createdAt": "2024-10-28T10:27:40.617222Z",
"updatedAt": "2024-10-28T10:27:40.617222Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:30.834Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25560 | 5438807"
},
{
"id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
"description": "Phát hiện người đi qua",
"timestamp": 1730111247422,
"timeStart": 1730111260581,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C1",
"cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
"memberID": "PID 25556 | 5427219",
"createdAt": "2024-10-28T10:27:41.516926Z",
"updatedAt": "2024-10-28T10:27:41.516926Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:27.422Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25556 | 5427219"
},
{
"id": "cb029640-1e8b-4009-9def-62093be66e6d",
"description": "Phát hiện người đi qua",
"timestamp": 1730111251603,
"timeStart": 1730111258579,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25557 | 5438807",
"createdAt": "2024-10-28T10:27:39.716697Z",
"updatedAt": "2024-10-28T10:27:39.716697Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:31.603Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25557 | 5438807"
},
{
"id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
"description": "Phát hiện người đi qua",
"timestamp": 1730111250834,
"timeStart": 1730111259580,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25560 | 5438807",
"createdAt": "2024-10-28T10:27:40.617222Z",
"updatedAt": "2024-10-28T10:27:40.617222Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:30.834Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25560 | 5438807"
},
{
"id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
"description": "Phát hiện người đi qua",
"timestamp": 1730111247422,
"timeStart": 1730111260581,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C1",
"cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
"memberID": "PID 25556 | 5427219",
"createdAt": "2024-10-28T10:27:41.516926Z",
"updatedAt": "2024-10-28T10:27:41.516926Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:27.422Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25556 | 5427219"
},
{
  "id": "cb029640-1e8b-4009-9def-62093be66e6d",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111251603,
  "timeStart": 1730111258579,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C3",
  "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
  "memberID": "PID 25557 | 5438807",
  "createdAt": "2024-10-28T10:27:39.716697Z",
  "updatedAt": "2024-10-28T10:27:39.716697Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:31.603Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25557 | 5438807"
},
{
  "id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111250834,
  "timeStart": 1730111259580,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C3",
  "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
  "memberID": "PID 25560 | 5438807",
  "createdAt": "2024-10-28T10:27:40.617222Z",
  "updatedAt": "2024-10-28T10:27:40.617222Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:30.834Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25560 | 5438807"
},
{
  "id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111247422,
  "timeStart": 1730111260581,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C1",
  "cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
  "memberID": "PID 25556 | 5427219",
  "createdAt": "2024-10-28T10:27:41.516926Z",
  "updatedAt": "2024-10-28T10:27:41.516926Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:27.422Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25556 | 5427219"
},
{
"id": "cb029640-1e8b-4009-9def-62093be66e6d",
"description": "Phát hiện người đi qua",
"timestamp": 1730111251603,
"timeStart": 1730111258579,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25557 | 5438807",
"createdAt": "2024-10-28T10:27:39.716697Z",
"updatedAt": "2024-10-28T10:27:39.716697Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:31.603Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25557 | 5438807"
},
{
"id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
"description": "Phát hiện người đi qua",
"timestamp": 1730111250834,
"timeStart": 1730111259580,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25560 | 5438807",
"createdAt": "2024-10-28T10:27:40.617222Z",
"updatedAt": "2024-10-28T10:27:40.617222Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:30.834Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25560 | 5438807"
},
{
"id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
"description": "Phát hiện người đi qua",
"timestamp": 1730111247422,
"timeStart": 1730111260581,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C1",
"cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
"memberID": "PID 25556 | 5427219",
"createdAt": "2024-10-28T10:27:41.516926Z",
"updatedAt": "2024-10-28T10:27:41.516926Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:27.422Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25556 | 5427219"
},
{
"id": "cb029640-1e8b-4009-9def-62093be66e6d",
"description": "Phát hiện người đi qua",
"timestamp": 1730111251603,
"timeStart": 1730111258579,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25557 | 5438807",
"createdAt": "2024-10-28T10:27:39.716697Z",
"updatedAt": "2024-10-28T10:27:39.716697Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:31.603Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25557 | 5438807"
},
{
"id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
"description": "Phát hiện người đi qua",
"timestamp": 1730111250834,
"timeStart": 1730111259580,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25560 | 5438807",
"createdAt": "2024-10-28T10:27:40.617222Z",
"updatedAt": "2024-10-28T10:27:40.617222Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:30.834Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25560 | 5438807"
},
{
"id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
"description": "Phát hiện người đi qua",
"timestamp": 1730111247422,
"timeStart": 1730111260581,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C1",
"cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
"memberID": "PID 25556 | 5427219",
"createdAt": "2024-10-28T10:27:41.516926Z",
"updatedAt": "2024-10-28T10:27:41.516926Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:27.422Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25556 | 5427219"
},
{
  "id": "cb029640-1e8b-4009-9def-62093be66e6d",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111251603,
  "timeStart": 1730111258579,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C3",
  "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
  "memberID": "PID 25557 | 5438807",
  "createdAt": "2024-10-28T10:27:39.716697Z",
  "updatedAt": "2024-10-28T10:27:39.716697Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:31.603Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25557 | 5438807"
},
{
  "id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111250834,
  "timeStart": 1730111259580,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C3",
  "cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
  "memberID": "PID 25560 | 5438807",
  "createdAt": "2024-10-28T10:27:40.617222Z",
  "updatedAt": "2024-10-28T10:27:40.617222Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:30.834Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25560 | 5438807"
},
{
  "id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
  "description": "Phát hiện người đi qua",
  "timestamp": 1730111247422,
  "timeStart": 1730111260581,
  "image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
  "imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
  "imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
  "storageBucket": "traffic-ai-engine",
  "eventType": "AI_EVENT_PERSON_RECOGNITION",
  "camName": "MCL12D_AF_C1",
  "cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
  "memberID": "PID 25556 | 5427219",
  "createdAt": "2024-10-28T10:27:41.516926Z",
  "updatedAt": "2024-10-28T10:27:41.516926Z",
  "deletedMark": false,
  "deletedAt": "0001-01-01T00:00:00Z",
  "longtitudeOfCam": 105.9101839240255,
  "latitudeOfCam": 21.047448929910566,
  "eventTypeString": "Sự kiện AI chưa phân loại",
  "location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
  "status": "NEW",
  "converTimestamp": "2024-10-28T10:27:27.422Z",
  "cabinID": "00000000-0000-0000-0000-000000000000",
  "result": "PID 25556 | 5427219"
},
{
"id": "cb029640-1e8b-4009-9def-62093be66e6d",
"description": "Phát hiện người đi qua",
"timestamp": 1730111251603,
"timeStart": 1730111258579,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25557 | 5438807",
"createdAt": "2024-10-28T10:27:39.716697Z",
"updatedAt": "2024-10-28T10:27:39.716697Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:31.603Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25557 | 5438807"
},
{
"id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
"description": "Phát hiện người đi qua",
"timestamp": 1730111250834,
"timeStart": 1730111259580,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25560 | 5438807",
"createdAt": "2024-10-28T10:27:40.617222Z",
"updatedAt": "2024-10-28T10:27:40.617222Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:30.834Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25560 | 5438807"
},
{
"id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
"description": "Phát hiện người đi qua",
"timestamp": 1730111247422,
"timeStart": 1730111260581,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C1",
"cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
"memberID": "PID 25556 | 5427219",
"createdAt": "2024-10-28T10:27:41.516926Z",
"updatedAt": "2024-10-28T10:27:41.516926Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:27.422Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25556 | 5427219"
},
{
"id": "cb029640-1e8b-4009-9def-62093be66e6d",
"description": "Phát hiện người đi qua",
"timestamp": 1730111251603,
"timeStart": 1730111258579,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_fullframe.jpg%22\u0026X-Amz-Signature=92c7347b708270040673fde0873ece496ef25cfff1dd8fec3cca1a48ef4aa3ce",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111251603_5438807_person_25557.jpg%22\u0026X-Amz-Signature=2d9ae7b728e432bdb7155d149d3d4aaac5dbcd8c5839c6e5c2caf6ea9257a127",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25557 | 5438807",
"createdAt": "2024-10-28T10:27:39.716697Z",
"updatedAt": "2024-10-28T10:27:39.716697Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:31.603Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25557 | 5438807"
},
{
"id": "9f36f490-f21b-4a9d-a407-d955a8503a88",
"description": "Phát hiện người đi qua",
"timestamp": 1730111250834,
"timeStart": 1730111259580,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_fullframe.jpg%22\u0026X-Amz-Signature=44478995fb84cb81edda6e5f1efca9c99494fe22d5ba4471c5f6f4e11ce1e394",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3_1730111250834_5438807_person_25560.jpg%22\u0026X-Amz-Signature=ff09b32256a81cc05e443d6780ff32e70c89ec0aab49f3c5e652e85250273308",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C3",
"cameraId": "43fd8c86-f3a4-44da-a48c-f483f118deee",
"memberID": "PID 25560 | 5438807",
"createdAt": "2024-10-28T10:27:40.617222Z",
"updatedAt": "2024-10-28T10:27:40.617222Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_ADMIN_OUTSIDE_F000051242C3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:30.834Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25560 | 5438807"
},
{
"id": "cf0cc9d4-4b9c-41e1-bbd4-19cc864162cf",
"description": "Phát hiện người đi qua",
"timestamp": 1730111247422,
"timeStart": 1730111260581,
"image": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageResult": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_fullframe.jpg%22\u0026X-Amz-Signature=56fb7a077c03cb99da7d3d8e2f8cf463a8b048e446c8057844517c2fda24e5b9",
"imageObject": "https://dev-minio-api.basesystem.one/traffic-ai-engine/2024-10-28/NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=PNFIK0TCWXFZQKU0%2F20241028%2Fus-east-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241028T102745Z\u0026X-Amz-Expires=86400\u0026X-Amz-SignedHeaders=host\u0026response-content-disposition=attachment%3B%20filename%3D%222024-10-28%2FNTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3_1730111247422_5427219_person_25556.jpg%22\u0026X-Amz-Signature=88f89e7cba7d3b284bcc8edd8e3df3381127719c1e32fc029e349fdc9d779871",
"storageBucket": "traffic-ai-engine",
"eventType": "AI_EVENT_PERSON_RECOGNITION",
"camName": "MCL12D_AF_C1",
"cameraId": "91b02ecc-f2cc-4f95-ab2f-7a7e9998c1ff",
"memberID": "PID 25556 | 5427219",
"createdAt": "2024-10-28T10:27:41.516926Z",
"updatedAt": "2024-10-28T10:27:41.516926Z",
"deletedMark": false,
"deletedAt": "0001-01-01T00:00:00Z",
"longtitudeOfCam": 105.9101839240255,
"latitudeOfCam": 21.047448929910566,
"eventTypeString": "Sự kiện AI chưa phân loại",
"location": "NTQ_POC_F10_SIDEGATE_INSIDE_F000051242D3",
"status": "NEW",
"converTimestamp": "2024-10-28T10:27:27.422Z",
"cabinID": "00000000-0000-0000-0000-000000000000",
"result": "PID 25556 | 5427219"
},
  ];
  
  const EventList = () => {
    const [openPopup, setOpenPopup] = useState(false);
    const [savedImage, setSavedImage] = useState(null); // State to hold the saved image
    const [numberInput, setNumberInput] = useState(''); // State for number input
    const [selectedCamera, setSelectedCamera] = useState(null); // State for selected camera
    const [results, setResults] = useState([]); // State for search results

    const handleSearchClick1 = () => {
      setOpenPopup(true);
    };

    const closePopup = () => {
      setOpenPopup(false);
    };

    const handleSearchClick = () => {
      // Sử dụng dữ liệu giả để mô phỏng tìm kiếm
      const filteredResults = fakeData.filter(item => 
        item.camName === selectedCamera?.title && 
        item.memberID.includes(numberInput)
      );
      setResults(filteredResults); // Lưu kết quả vào state
      console.log('Search Results:', filteredResults); // Xem kết quả trong console
    };
  
    const handleImageSave = (imageDataArray) => {
      setSavedImage(imageDataArray); // Save the array of images
      console.log('Saved Images:', imageDataArray); // Handle the saved images as needed
    };

    return (
      <>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={0.5}>
              <IconButton onClick={handleSearchClick1}>
                <Icon icon='tabler:upload' /> 
              </IconButton>
            </Grid>
          <Grid item xs={2}>
            <TextField
              label="Similarity"
              variant="outlined"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Autocomplete
              options={cameras}
              getOptionLabel={(option) => option.title}
              onChange={(event, newValue) => setSelectedCamera(newValue)}
              renderInput={(params) => <TextField {...params} label="Select camera" variant="outlined" />}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.5}>
          <Button variant='contained' color='primary' onClick={handleSearchClick}>
              Search
            </Button>  
        </Grid>
            </Grid>
         
        </Paper>

        {openPopup && (
          <ImageForm
            onClose={closePopup}
            onSave={handleImageSave} // Pass the handler to ImageForm
          />
        )}

  
      <Grid container spacing={2} style={{ marginTop: '32px' }}>
        <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={3} style={{ padding: '16px', flex: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
              {savedImage && (
                  <div>
                    {savedImage.map((image, index) => (
                      <img key={index} src={image} alt={`Saved ${index + 1}`} style={{ height: '250px', width: '250px', marginBottom: '10px' }} />
                    ))} </div>
                  )}
              </Grid>
              <Grid item xs={8}>
                <Grid item xs={12}>
                  <Typography variant="h5">Timeline </Typography>
                  <Timeline
                    sx={{
                      [`& .MuiTimelineOppositeContent-root`]: {
                        flex: 0.2,
                      },
                    }}
                  >
                    {fakeData.map(event => (
                      <TimelineItem key={event.id}>
                        <TimelineOppositeContent color="textSecondary">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="h6">{event.location}</Typography>
                          <Typography sx={{ marginTop: '10px' }}>
                            {event?.timestamp ? new Date(event?.timestamp).toLocaleString() : 'Date'}
                          </Typography>
                          <Typography variant="p">{event.description}</Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={3} style={{ padding: '16px', flex: 1 }}>
            <h2>Image</h2>
            <CardContent>
              {fakeData?.length === 0 ? (
                <Typography variant='h6' align='center'>
                  No data available
                </Typography>
              ) : (
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  {fakeData?.map((item, index) => (
                    <Grid item xs={12} sm={6} lg={2.4} key={index}>
                      <Card
                        sx={{
                          width: '100%',
                          height: '300px',
                          borderWidth: 1,
                          borderRadius: '10px',
                          borderStyle: 'solid',
                          borderColor: '#ccc'
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              height: '100%',
                              minHeight: 140,
                              display: 'flex',
                              alignItems: 'flex-end',
                              justifyContent: 'center'
                            }}
                          >
                            <img
                              width={'100%'}
                              height={150}
                              alt='add-role'
                              src={item?.imageObject}
                              style={{
                                objectFit: 'contain',
                                cursor: 'pointer'
                              }}
                            />
                          </Box>
                          <Typography sx={{ marginTop: '10px' }}>
                            {item?.timestamp ? new Date(item?.timestamp).toLocaleString() : 'Date'}
                          </Typography>
                          <Typography
                            sx={{
                              marginTop: '10px',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item?.description} 
                          </Typography>
                          <Typography sx={{ marginTop: '10px' }}>
                            {item?.location ? item?.location : 'Location'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
      </>
    );
  };

  export default EventList;
