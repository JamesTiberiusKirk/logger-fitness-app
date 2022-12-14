import React, { useEffect } from "react";
import { Button, Text } from 'react-native-paper'
import { ScrollView, StyleSheet, View } from 'react-native'
import { FormBuilder } from 'react-native-paper-form-builder';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from "../state/auth";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useToast } from "react-native-toast-notifications";

export default function LoginScreen() {
    const [login, { isLoading }] = useLoginMutation()
    const toast = useToast()
    const { control, setFocus, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    return (
        <View style={styles.containerStyle}>
            <Spinner
                visible={isLoading}
                textContent={'Logging in...'}
                textStyle={styles.spinnerTextStyle}
            />
            <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                <Text style={styles.headingStyle}>Login</Text>
                <FormBuilder
                    control={control}
                    setFocus={setFocus}
                    formConfigArray={[
                        {
                            type: 'email',
                            name: 'email',
                            rules: {
                                required: {
                                    value: true,
                                    message: 'Email is required',
                                },
                            },
                            textInputProps: {
                                label: 'Email',
                            },
                        },
                        {
                            type: 'password',
                            name: 'password',
                            rules: {
                                required: {
                                    value: true,
                                    message: 'Password is required',
                                },
                            },
                            textInputProps: {
                                label: 'Password',
                            },
                        },
                    ]}
                />
                <Button
                    style={styles.button}
                    mode={'contained'}
                    onPress={handleSubmit((data: any) => {
                        console.log('form data', data);
                        login(data)
                    })}>
                    Submit
                </Button>
                <Button
                    style={styles.button}
                    mode={'contained'}
                    onPress={()=>{
                        toast.show("Not implemented yet");
                    }}
                >
                    Google  Oauth
                </Button>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
    },
    scrollViewStyle: {
        flex: 1,
        padding: 25,
        justifyContent: 'center',
    },
    headingStyle: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 40,
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    button: {
        marginBottom: 15,
        padding: 5,
    },
});
