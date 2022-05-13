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

  (cond
    (re-matches #"```.+" next) (conj acc [next])
    (= next "```") (let [new-array (conj (last acc) next)]
                     (conj (vec (drop-last acc)) new-array))
    :else (let [new-array (conj (last acc) next)]
            (conj (vec (drop-last acc)) new-array))))

;; (pprint (reduce group-blocks [] '("```bash" "wow" "```" "```bash" "yes" "```")))

(->> lines
     (remove #(= "" %))
     (remove #(string/starts-with? % "#"))
     (reduce group-blocks [])
     pprint)

;; (def codeblocks [])

;; (with-open [rdr (open-file file)]
;;   (println "ok"))

;;;; checks? what if i dont close with ```, or if i detect an opening ```?
