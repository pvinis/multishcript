#!/usr/bin/env bb


(require '[babashka.fs :as fs])
(require '[clojure.string :as string])

(when (not= 1 (count *command-line-args*))
  (println "Only use one arg, with the path to the multishcript you want to run.")
  (System/exit 1))

(def file (first *command-line-args*))

(when (not (fs/exists? file))
  (println "Multishcript file doesn't exist.")
  (System/exit 1))

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

(map make-)

;;;; checks? what if i dont close with ```, or if i detect an opening ```?
