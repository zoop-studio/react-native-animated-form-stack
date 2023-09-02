# react-native-animated-form-stack

![version-badge](https://img.shields.io/npm/v/react-native-animated-form-stack.svg)


## Introduction
Have you ever wondered about creating a component like this? Or have you ever seen such a UI and wished you could implement it effortlessly?

<img alt="Screenshot image" src="https://raw.githubusercontent.com/zoop-studio/react-native-animated-form-stack/main/docs/screenshot.gif" width='250' />

What if just wrapping your existing Form UI with our component could achieve this effect? No need for any additional external libraries; the ones you're already using in your project are sufficient.

Experience the magic of animated forms in a lightweight package of just under **3 KB**. 

## Install

```bash
yarn add react-native-animated-form-stack
```

## Usage

### 1. Wrap `FormStackProvider` and `FormStack`

By wrapping your filed UI with `FormStackProvider` and `FormStack` as you want, you will get a dynamic form which is automatically calculates its steps based on the arrangement of the fields and applies dynamic effects.

```tsx
import { FormStackProvider, FormStack } from 'react-native-animated-form-stack';

const Example = () => {
    return (
        <FormStack>
            {/* just place your form here! */}
        </FormStack>
    ) 
}

const App = () => {
    return <FormStackProvider>
        <Example />
    </FormStackProvider>
}
```

### 2. Use hooks

If you complete the previous step, now you can use hooks which are able to obtain or update the current step.

```tsx
import { 
    ...
    useFormStackValue,
    useFormStackAction
} from 'react-native-animated-form-stack';
import { View, Text } from 'react-native';

const ThirdField = () => {
    const {step} = useFormStackValue();
    return (
        <View>
            <Text>{step}</Text>
        </View>
    )
}

const FirstField = () => {
    const {update} = useFormStackAction();
    return (
        <View>
            {/* This action expected to expose `ThirdFiled` */}
            <Button title={'Go to step 2'} onPress={() => update(2)} />
        </View>
    )
}

const Example = () => {
    return (
        <FormStack>
            <ThirdField />
            <SecondField />
            <FirstField />
        </FormStack>
    ) 
}

const App = () => {
    return <FormStackProvider>
        <Example />
    </FormStackProvider>
}
```

<img alt="Screenshot image" src="https://raw.githubusercontent.com/zoop-studio/react-native-animated-form-stack/main/docs/screenshot-use-hook.gif" width='250' />

### 3. Use methods

Or in case of you don't need to use hook, you can handle the step by methods.

```tsx
import { 
    ...
    IFormStackRef
} from 'react-native-animated-form-stack';

const Example = () => {
    const ref = useRef<IFormStackRef>(null);
    const [step, setStep] = useState(0);
    
    // You can call the method which is able to handle inner state of the `FormStack`
    const handlePressPrev = () => {
        ref.current?.prev();
    };
    
    const handlePressNext = () => {
        ref.current?.next();
    };
    
    return (
        <View style={{ flex: 1 }}>
            <FormStack
                ref={ref}
                onUpdate={setStep} // Update a state when `FormStack` is updated
            >
                {/* just place your form here! */}
            </FormStack>
            <View>
                <Button title={'Previous'} onPress={handlePressPrev} />
                <Button title={'Next'} onPress={handlePressNext} />
            </View>
        </View>
    ) 
}
```

<img alt="Screenshot image" src="https://raw.githubusercontent.com/zoop-studio/react-native-animated-form-stack/main/docs/screenshot-use-method.gif" width='250' />

## Contribute

<img alt='ZOOP logo image' src='https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/d5/06/b1/d506b17a-d5ae-d496-d6a7-cbeff43a1b14/AppIcon-1x_U007emarketing-0-10-0-85-220.png/460x0w.webp' width='200' style="border-radius: 40px" />

This library is used in real-world products, and your contributions can help us make great updates to products uploaded
to the App Store and Play Store.

Download [Apple App Store](https://apps.apple.com/kr/app/zoop-%ED%95%B4%EC%99%B8%EC%97%AC%ED%96%89-%EA%B0%80%EA%B3%84%EB%B6%80/id6447391288) or [Google Play Store](https://play.google.com/store/apps/details?id=com.zoop.app),
a budgeting app for international travelers, today.

## License

[MIT licensed.](https://github.com/zoop-studio/react-native-numberpad/blob/main/LICENSE)
