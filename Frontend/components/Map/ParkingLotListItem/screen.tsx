import React from "react";
import {
  Button,
  Card,
  H2,
  Image,
  Paragraph,
  Text,
  XStack,
  YStack
} from "tamagui";
const ParkingLotListItem = ({ parkingLot }) => {
  return (
    <YStack
      position="absolute"
      flex={1}
      justifyContent="center"
      bottom={0}
      backgroundColor="white"
      padding={10}
      width={300}
      height={200}
      borderRadius={10}
      opacity={0.9}
    >
      <XStack flex={1}>
        <Button borderRadius="$10">X</Button>
        <Text fontWeight={"bold"}>{parkingLot.LotId}</Text>
      </XStack>

      <XStack
        flex={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <YStack marginRight={20}>
          <Image
            resizeMode="contain"
            source={{
              width: 150,
              height: 200,
              uri: require("../../../assets/images/parking-lot-image.png")
            }}
            opacity={0.4}
          />
        </YStack>
        <YStack>
          <Text>Occupancy: {parkingLot.Occupancy}</Text>
          <Text>Capacity: {parkingLot.Capacity}</Text>
        </YStack>
      </XStack>

      <XStack>
        <Button
          borderRadius="$10"
          flex={1}
          alignSelf="flex-end"
        >
          Book
        </Button>
      </XStack>
      {/* <Card
        elevate
        bordered
        backgroundColor="white"
        width={300}
        opacity={0.9}
      >
        <Card.Header padded>
          <H2>{parkingLot.LotId}</H2>
          <Paragraph fontWeight="bold">
            Occupancy: {parkingLot.Occupancy}
          </Paragraph>
          <Paragraph fontWeight="bold">
            Capacity: {parkingLot.Capacity}
          </Paragraph>
        </Card.Header>
        <Card.Footer padded>
          <XStack flex={1} />
          <Button borderRadius="$10">Book</Button>
        </Card.Footer>
        <Card.Background>
          <Image
            resizeMode="contain"
            alignSelf="center"
            source={{
              width: 300,
              height: 300,
              uri: require("../../../assets/images/parking-lot-image.png")
            }}
            opacity={0.4}
          />
        </Card.Background>
      </Card> */}
    </YStack>
  );
};

export default ParkingLotListItem;
