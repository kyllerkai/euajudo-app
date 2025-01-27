/* eslint-disable */
import React from 'react';
import {
  AiOutlineUserDelete,
  AiFillFileText,
  AiFillPhone,
  AiOutlineTeam,
} from 'react-icons/ai';

import { Box, SimpleGrid, Select } from '@chakra-ui/react';
import { LeafletMouseEvent } from 'leaflet';
import swal from 'sweetalert';
import { Map as MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useHistory } from 'react-router-dom';
import mapIcon from '../../../utils/';
import api from '../../../api/';
import * as ROUTES from '../../../constants/routes';
import Button from '../ButtonSend/';
import { Input, Alert, FormControl } from '../../../components';
const ContactForm: React.FC = () => {
  const history = useHistory();
  const [position, setPosition] = React.useState({ latitude: 0, longitude: 0 });
  const [about, setAbout] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [namePoint, setNamePoint] = React.useState('');
  const [responsibleName, setResponsible] = React.useState('');
  const [typePoint, setTypePoint] = React.useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setPosition({ latitude: lat, longitude: lng });
  };
  const [userPosition, setUserPosition] = React.useState({
    latitude: 0,
    longitude: 0,
  });
  navigator.geolocation.getCurrentPosition((position) => {
    setUserPosition({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    const { latitude, longitude } = position;
    const data = {
      namePoint,
      latitude,
      longitude,
      about,
      whatsapp,
      responsibleName,
      typePoint,
    };
    if (latitude === 0 && longitude === 0) {
      swal("Calma lá", "Selecione um local no mapa", "error");
    } else {
      try {
        setLoading(true);
        await api.post('/registionPoint/', data);
        swal(`Cadastro Realizado!`,
          `O seu ponto ${Number(namePoint) >= 6 ? namePoint : namePoint.substring(1, namePoint.length)}`
          + `..., foi cadastrado`, "success");
      } catch (error) {
        swal("Ops!", `${Number(namePoint) >= 6 ? namePoint : namePoint.substring(1, namePoint.length)}`
          + `...`, "error");
      } finally {
        setLoading(false);
        setTimeout(() => {
          history.push(ROUTES.APPMAP);
        }, 4000);
      };
    }
  };

  return (
    <Box my={8} textAlign="left" onSubmit={handleSubmit} as="form" method="POST">
      <MapContainer
        center={[userPosition.latitude, userPosition.longitude]}
        zoom={15.7}
        style={
          { width: '100%', height: 280, borderRadius: 7 }
        }
        onclick={handleMapClick}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2F5b2t5bGVyIiwiYSI6ImNrcG55N3RnaDBrdnkydm13YTIwdDQ2MXAifQ.mPGFip4w4KhoZSqmUqoY2w`}
        />
        <Marker
          icon={mapIcon}
          interactive={false}
          position={[position.latitude, position.longitude]}
        />
      </MapContainer>
      <Alert />
      <SimpleGrid columns={[1, 1, 2]} spacing={2}>
        <FormControl id="nome" mt={1} name="Nome">
          <Input
            type="text"
            placeholder="Insira o seu nome"
            name="responsible"
            iconLeft={<AiOutlineUserDelete />}
            onChange={(e) => setResponsible(e.target.value)}
          />
        </FormControl>
        <FormControl id="descricao" mt={1} name="Número para contato:">
          <Input
            type="text"
            name="whatsapp"
            placeholder="Número de contato"
            onChange={(e) => setWhatsapp(e.target.value)}
            iconLeft={<AiFillPhone />}
          />
        </FormControl>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 2]} spacing={2}>
        <FormControl id="pointName" mt={2} name="Nome do local">
          <Input
            type="text"
            name="pointName"
            placeholder="Insira o seu ponto"
            iconLeft={<AiOutlineTeam />}
            onChange={(e) => setNamePoint(e.target.value)}
          />
        </FormControl>
        <FormControl id="typePoint" mt={2} name="É um ponto de vacinação?">
          <Select placeholder="Selecione uma opção" required onChange={(e) => setTypePoint(e.target.value)}>
            <option value="sim">Sim</option>
            <option value="não">Não</option>
          </Select>
        </FormControl>
      </SimpleGrid>
      <FormControl id="descricao" mt={2} name="Descrição">
        <Input
          type="text"
          name="about"
          placeholder="Insira a sua descrição"
          iconLeft={<AiFillFileText />}
          onChange={(e) => setAbout(e.target.value)}
        />
      </FormControl>
      <Button loading={loading} />
    </Box>
  );
};

export default ContactForm;
