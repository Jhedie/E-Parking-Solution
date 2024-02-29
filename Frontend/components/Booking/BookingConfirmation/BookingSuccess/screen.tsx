import { AntDesign } from "@expo/vector-icons";
import { Dimensions, Modal, Text, TouchableOpacity, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";

const { width } = Dimensions.get("window");

interface BookingSuccessModalProps {
  visible: boolean;
  bookingSuccessModalClose: () => void;
  onParkingTicketHandler: () => void;
  onBackToHomeHandler: () => void;
}

const BookingSuccessModal = (props: BookingSuccessModalProps) => {
  console.log("BookingSuccessModal", props.visible);
  return (
    <Modal
      transparent={true}
      visible={props.visible}
      onRequestClose={props.bookingSuccessModalClose}
      animationType="fade"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={props.onParkingTicketHandler}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
        >
          <View
            style={{
              paddingTop: 10 * 2.2,
              paddingHorizontal: 10 * 3.3,
              paddingBottom: 10 * 2.6,
              width: width * 0.9,
              borderRadius: 10,
              backgroundColor: "white"
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <AntDesign
                name="checkcircle"
                size={45}
                color="black"
              />
              <Text
                style={{
                  marginTop: 10 * 3
                }}
              >
                Successful!!
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10
                }}
              >
                Great, Your Booking has been confirmed!
              </Text>
            </View>

            <AwesomeButton
              height={50}
              onPress={() => props.onParkingTicketHandler()}
              raiseLevel={1}
              stretch={true}
              borderRadius={10}
              style={{ marginTop: 10 * 2 }}
              backgroundColor="white"
              backgroundShadow="black"
            >
              <Text style={{}}>View Parking Ticket</Text>
            </AwesomeButton>
            <View
              style={{
                marginTop: 10 * 2
              }}
            >
              <AwesomeButton
                height={50}
                onPress={() => props.onBackToHomeHandler()}
                raiseLevel={1}
                stretch={true}
                borderRadius={10}
                backgroundColor="black"
                backgroundShadow="black"
              >
                <Text
                  numberOfLines={1}
                  style={{ overflow: "hidden", color: "white" }}
                >
                  Back Home
                </Text>
              </AwesomeButton>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default BookingSuccessModal;
