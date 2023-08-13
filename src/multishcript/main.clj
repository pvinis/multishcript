#!/usr/bin/env bb

(ns multishcript.main
  (:require [clojure.string :as string]
            [multishcript.guards :refer [guard-args guard-file-exists]]))

(guard-args *command-line-args*)

(def file (first *command-line-args*))
(guard-file-exists file)

(print file)

(def lines (fs/read-all-lines file))

(defn group-blocks
  [acc next]

  (let [lang (last (re-matches #"```(.+)" next))]
    (cond
      (some? lang) (conj acc {:lang lang :code []})
      (= next "```") acc
      :else (let [new-code (conj (:code (last acc)) next)
                  new-map (assoc (last acc) :code new-code)]
              (conj (vec (drop-last acc)) new-map)))))

(def codeblocks
  (->> lines
       (remove #(= "" %))
       (remove #(string/starts-with? % "#"))
       (reduce group-blocks [])))

;; (map make-)

;;;; checks? what if i dont close with ```, or if i detect an opening ```?