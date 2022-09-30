import React from "react";
import { StyleSheet } from 'react-native'
import { View, Text } from "../components/Themed";
import { useWorkoutsQuery } from "../state/workouts";
import { RootTabScreenProps } from "../types";
import { SwipeListView } from 'react-native-swipe-list-view';
import Spinner from "react-native-loading-spinner-overlay/lib";



function WorkoutsList() {
    const { data: workouts, isLoading } = useWorkoutsQuery()
    console.log(workouts);

    return (
        <View>
            <SwipeListView
                data={workouts?.map((workoutGroup, index) => ({ key: index, ...workoutGroup }))}
                renderItem={(data, rowMap) => (
                    <View style={styles.rowFront}>
                        <Text>{data.item.key}</Text>
                        <Text>{data.item.workout.title}</Text>
                    </View>
                )}
                renderHiddenItem={(data, rowMap) => (
                    <View style={styles.rowBack}>
                        <Text>Left</Text>
                        <Text>Right</Text>
                    </View>
                )}
                leftOpenValue={75}
                rightOpenValue={- 75}
            />
            <Spinner
                visible={isLoading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
        </View>

    )

}

export default function WorkoutsScreen({ navigation }: RootTabScreenProps<'Workouts'>) {
    return (
        <View>
            <Text>Workouts</Text>
            <WorkoutsList/>
        </View>
    )

}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
    rowFront:{

    },
    rowBack:{

    }
})