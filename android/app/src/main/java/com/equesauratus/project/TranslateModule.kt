package com.equesauratus.project

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.google.mlkit.nl.languageid.LanguageIdentification
import com.google.mlkit.nl.languageid.LanguageIdentificationOptions
import com.google.mlkit.nl.translate.TranslateLanguage
import com.google.mlkit.nl.translate.Translation
import com.google.mlkit.nl.translate.TranslatorOptions

@ReactModule(name = TranslatorModule.NAME)
class TranslatorModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val NAME = "Translator"
    }
    override fun getName(): String = NAME


    @ReactMethod
    fun translateWord(word: String, lang: String, promise: Promise) {
        Log.i("Translate", "Word to translate: $word")

        val languageIdentifier = LanguageIdentification.getClient(
            LanguageIdentificationOptions.Builder()
                .setConfidenceThreshold(0.3f)
                .build())

        languageIdentifier.identifyLanguage(word)
            .addOnSuccessListener { languageCode ->
                if (languageCode == "und") {
                    Log.i("lang", "Can't identify language.")
                    promise.resolve("Can't identify language.")
                } else {
                    Log.i("lang", "Language: $languageCode")
                    val srcLang = TranslateLanguage.fromLanguageTag(languageCode) ?: "en"
                    val targLang = TranslateLanguage.fromLanguageTag(lang) ?: "en"

                    val options = TranslatorOptions.Builder()
                        .setSourceLanguage(srcLang)
                        .setTargetLanguage(targLang)
                        .build()
                    val translator = Translation.getClient(options)

                    translator.downloadModelIfNeeded()
                        .addOnSuccessListener {
                            translator.translate(word)
                                .addOnSuccessListener { translatedText ->
                                    Log.i("Translate", "Translated text: $translatedText")
                                    promise.resolve(translatedText)
                                }
                                .addOnFailureListener { e ->
                                    Log.e("Translate", "Translation failed: ${e.message}")
                                    promise.reject("TRANSLATION_FAILED", "Translation failed: ${e.message}")
                                }
                        }
                        .addOnFailureListener { e ->
                            Log.e("Translate", "Model download failed: ${e.message}")
                            promise.reject("MODEL_DOWNLOAD_FAILED", "Model download failed: ${e.message}")
                        }
                }
            }
            .addOnFailureListener { e ->
                Log.e("langE", "Language identification failed: ${e.message}")
                promise.reject("LANG_IDENT_FAILED", "Language identification failed: ${e.message}")
            }
    }
}
