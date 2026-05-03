import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen({ navigation }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    if (phone.trim() && !/^[\d\s\-+().]{7,}$/.test(phone.trim())) e.phone = 'Enter a valid phone number';
    return e;
  };

  const handleSignup = async () => {
    setGeneralError('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    const { error } = await signUp({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || null,
    });
    setSubmitting(false);

    if (error) {
      if (error.message?.includes('already registered')) {
        setGeneralError('This email is already registered. Try signing in.');
      } else {
        setGeneralError(error.message || 'Something went wrong');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.brand}>Cafe Codex</Text>
            <Text style={styles.tagline}>Your personal record of the world's best cups</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.tabBarInactive}
              autoCorrect={false}
            />
            {errors.name ? <Text style={styles.fieldError}>{errors.name}</Text> : null}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={Colors.tabBarInactive}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}

            <Text style={styles.label}>Phone <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={phone}
              onChangeText={setPhone}
              placeholder="1234567890"
              placeholderTextColor={Colors.tabBarInactive}
              keyboardType="phone-pad"
            />
            {errors.phone ? <Text style={styles.fieldError}>{errors.phone}</Text> : null}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={password}
              onChangeText={setPassword}
              placeholder="Min 6 characters"
              placeholderTextColor={Colors.tabBarInactive}
              secureTextEntry
            />
            {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}

            {generalError ? <Text style={styles.error}>{generalError}</Text> : null}

            <TouchableOpacity
              testID="signup-button"
              style={[styles.button, submitting && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.link}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkAccent}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brand: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagline: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 6,
  },
  form: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  title: {
    color: Colors.cream,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  optional: {
    fontWeight: '400',
    color: Colors.tabBarInactive,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 10,
    padding: 14,
    color: Colors.cream,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#E05555',
  },
  fieldError: {
    color: '#E05555',
    fontSize: 12,
    marginTop: 4,
  },
  error: {
    color: '#E05555',
    fontSize: 13,
    marginTop: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  linkAccent: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
