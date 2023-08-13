(ns multishcript.guards
  (:require [babashka.fs :as fs]))

(defn guard-args
  [args]
  (when (not= 1 (count args))
    (println "Use only one arg, the path to the multishcript you want to run.")
    (System/exit 1)))

(defn guard-file-exists
  [file]
  (when (not (fs/exists? file))
    (println "File doesn't exist.")
    (System/exit 1)))

